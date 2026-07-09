import { Directionality } from '@angular/cdk/bidi';
import {
	afterRenderEffect,
	contentChildren,
	DestroyRef,
	Directive,
	DOCUMENT,
	ElementRef,
	inject,
	input,
	model,
	NgZone,
	output,
	untracked,
} from '@angular/core';
import { BrnResizablePanel } from './brn-resizable-panel';

let nextId = 0;

@Directive({
	selector: 'brn-resizable-group, [brnResizableGroup]',
	exportAs: 'brnResizableGroup',
	host: {
		'[attr.data-panel-group-direction]': 'direction()',
		'[attr.data-panel-group-id]': 'id()',
		'[id]': 'id()',
		'data-panel-group': '',
		'data-slot': 'resizable-panel-group',
	},
})
export class BrnResizableGroup {
	/** The id of the BrnResizableGroup */
	public readonly id = input<string>(`brn-resizable-group-${++nextId}`);

	/** Host element reference. */
	private readonly _el = inject(ElementRef<HTMLElement>);

	/** Layout direction, used to mirror horizontal resizing under RTL. */
	private readonly _dir = inject(Directionality);

	/** Group orientation */
	public readonly direction = input<'horizontal' | 'vertical'>('horizontal');

	/** @internal Access all the panels within the group */
	public readonly panels = contentChildren(BrnResizablePanel);

	/** event when resize starts */
	public readonly dragStart = output<void>();

	/** event when resize ends */
	public readonly dragEnd = output<void>();

	/** Resize panel group to the specified layout ([1 - 100, ...]). */
	public readonly layout = model<number[]>([]);

	/** Called when group layout changes */
	public readonly layoutChanged = output<number[]>();

	private readonly _document = inject(DOCUMENT);

	private readonly _zone = inject(NgZone);

	private _resizeRaf: number | null = null;

	private _pendingSizes: number[] | null = null;

	/** Tears down the in-flight drag (document listeners, queued frame, cursor); null when idle. */
	private _stopResize: (() => void) | null = null;
	/** Panel order and sizes from the last layout applied to the rendered panels. */
	private _knownPanels: readonly BrnResizablePanel[] = [];
	private _appliedLayout: number[] = [];

	constructor() {
		// If the group is destroyed mid-drag, the document listeners would otherwise stay attached
		// (document is never GC'd), pinning this directive and firing against a torn-down view.
		inject(DestroyRef).onDestroy(() => this._stopResize?.());

		afterRenderEffect(() => {
			// Track both membership and external model updates, but not the writes performed while reconciling them.
			const panels = this.panels();
			const layout = this.layout();
			untracked(() => this._synchronizePanelSizes(panels, layout));
		});
	}

	private _synchronizePanelSizes(panels: readonly BrnResizablePanel[], currentLayout: number[]): void {
		const totalPanels = panels.length;

		if (totalPanels === 0) {
			this._knownPanels = panels;
			this._appliedLayout = [];
			return;
		}

		const isInitialLayout = this._knownPanels.length === 0;
		const hasCompleteExternalLayout =
			!isInitialLayout &&
			currentLayout.length === totalPanels &&
			!this._layoutsEquivalent(currentLayout, this._appliedLayout);
		const membershipChanged = !isInitialLayout && !this._panelsEqual(panels, this._knownPanels);

		// Nothing external changed and the same panels are still mounted: the applied layout is already
		// correct. Falling through to the proportional-rescale branch would round-trip each size through
		// x/total*100, which is not bit-identical for fractional layouts; the drift feeds back into the
		// model and can loop until Angular throws NG0103 in zoneless apps.
		if (!isInitialLayout && !hasCompleteExternalLayout && !membershipChanged) {
			return;
		}

		let sizes: number[];
		if (isInitialLayout) {
			// Preserve the existing initialization contract: defaults take precedence over the input layout.
			sizes = panels.map((panel, index) => panel.defaultSize() ?? currentLayout[index] ?? 100 / totalPanels);
		} else if (hasCompleteExternalLayout) {
			// A complete changed layout is explicit consumer intent for the current panel order.
			sizes = [...currentLayout];
		} else {
			// Membership changed on its own: reserve new panel sizes, then preserve the relative proportions
			// of known panels within the remaining space.
			const previousSizes = new Map(this._knownPanels.map((panel, index) => [panel, this._appliedLayout[index]]));
			const newPanelSizes = new Map(
				panels
					.filter((panel) => !previousSizes.has(panel))
					.map((panel) => [panel, panel.defaultSize() ?? 100 / totalPanels]),
			);
			const newPanelsTotal = Array.from(newPanelSizes.values()).reduce((total, size) => total + size, 0);
			const previousPanelsTotal = panels.reduce((total, panel) => total + (previousSizes.get(panel) ?? 0), 0);

			if (newPanelsTotal <= 100 && previousPanelsTotal > 0) {
				const remainingSize = 100 - newPanelsTotal;
				sizes = panels.map(
					(panel) =>
						newPanelSizes.get(panel) ?? ((previousSizes.get(panel) ?? 0) / previousPanelsTotal) * remainingSize,
				);
			} else {
				const rawSizes = panels.map((panel) => newPanelSizes.get(panel) ?? previousSizes.get(panel) ?? 0);
				const totalSize = rawSizes.reduce((total, size) => total + size, 0);
				sizes = totalSize > 0 ? rawSizes.map((size) => (size / totalSize) * 100) : rawSizes;
			}
		}

		panels.forEach((panel, index) => panel.setSize(sizes[index]));
		this._knownPanels = panels;
		this._appliedLayout = [...sizes];

		if (!this._layoutsEquivalent(currentLayout, sizes)) {
			this._setLayout(sizes);
		}
	}

	// Percentages within this tolerance render identically; treat them as the same layout so
	// floating-point drift from a rescale round-trip can't feed back into the model (NG0103).
	private _layoutsEquivalent(first: readonly number[], second: readonly number[]): boolean {
		const epsilon = 1e-9;
		return first.length === second.length && first.every((size, index) => Math.abs(size - second[index]) < epsilon);
	}

	private _panelsEqual(first: readonly BrnResizablePanel[], second: readonly BrnResizablePanel[]): boolean {
		return first.length === second.length && first.every((panel, index) => panel === second[index]);
	}

	public startResize(handleIndex: number, event: MouseEvent | TouchEvent): void {
		event.preventDefault();

		// tear down any in-flight drag before starting a new one
		this._stopResize?.();

		const cursor = this.direction() === 'vertical' ? 'ns-resize' : 'ew-resize';
		this._document.body.style.cursor = `${cursor}`;
		const sizes = [...this.layout()];
		this.dragStart.emit();

		const startPosition = this._getEventPosition(event);
		const startSizes = [...sizes];
		// Horizontal resizing is mirrored under RTL: the panel order is reversed, so the pixel
		// delta is inverted in _handleResize to keep the handle tracking the pointer correctly.
		const isRtl = this.direction() === 'horizontal' && this._dir.valueSignal() === 'rtl';

		const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
			this._zone.runOutsideAngular(() => {
				this._handleResize(moveEvent, handleIndex, startPosition, startSizes, isRtl);
			});
		};

		// Detaches the document listeners, cancels any queued frame and restores the cursor. Stored
		// on the instance so it runs on normal drag-end and on destroy-during-drag alike.
		const cleanup = () => {
			this._document.removeEventListener('mousemove', handleMove);
			this._document.removeEventListener('touchmove', handleMove);
			this._document.removeEventListener('mouseup', handleEnd);
			this._document.removeEventListener('touchend', handleEnd);
			this._document.removeEventListener('touchcancel', handleEnd);
			this._document.body.style.cursor = 'default';

			if (this._resizeRaf !== null) {
				cancelAnimationFrame(this._resizeRaf);
				this._resizeRaf = null;
				this._pendingSizes = null;
			}

			this._stopResize = null;
		};

		const handleEnd = () => {
			this._zone.run(() => this._endResize());
			cleanup();
		};

		this._stopResize = cleanup;

		this._zone.runOutsideAngular(() => {
			this._document.addEventListener('mousemove', handleMove);
			this._document.addEventListener('touchmove', handleMove);
			this._document.addEventListener('mouseup', handleEnd);
			this._document.addEventListener('touchend', handleEnd);
			// touch drags can be interrupted by the system (touchcancel) without firing touchend;
			// end the resize on it too so listeners + cursor are not left dangling.
			this._document.addEventListener('touchcancel', handleEnd);
		});
	}

	private _handleResize(
		event: MouseEvent | TouchEvent,
		handleIndex: number,
		startPosition: number,
		startSizes: number[],
		isRtl = false,
	): void {
		const currentPosition = this._getEventPosition(event);
		const delta = (currentPosition - startPosition) * (isRtl ? -1 : 1);
		const containerSize = this._getContainerSize();
		const deltaPercentage = (delta / containerSize) * 100;

		const newSizes = [...startSizes];
		const panels = this.panels();

		const leftPanel = panels[handleIndex];
		const rightPanel = panels[handleIndex + 1];

		if (!leftPanel || !rightPanel) return;

		const leftMin = leftPanel.minSize();
		const leftMax = leftPanel.maxSize();
		const rightMin = rightPanel.minSize();
		const rightMax = rightPanel.maxSize();

		let newLeftSize = startSizes[handleIndex] + deltaPercentage;
		let newRightSize = startSizes[handleIndex + 1] - deltaPercentage;

		newLeftSize = Math.max(leftMin, Math.min(leftMax, newLeftSize));
		newRightSize = Math.max(rightMin, Math.min(rightMax, newRightSize));

		const totalSize = newLeftSize + newRightSize;
		const originalTotal = startSizes[handleIndex] + startSizes[handleIndex + 1];

		if (Math.abs(totalSize - originalTotal) < 0.01) {
			newSizes[handleIndex] = newLeftSize;
			newSizes[handleIndex + 1] = newRightSize;

			// batch update
			this._queueResize(newSizes);
		}
	}

	private _queueResize(sizes: number[]): void {
		this._pendingSizes = sizes;

		if (this._resizeRaf !== null) return;

		this._resizeRaf = requestAnimationFrame(() => {
			this._resizeRaf = null;
			if (this._pendingSizes) {
				this._setLayout(this._pendingSizes);
				this.updatePanelStyles();
				this._pendingSizes = null;
			}
		});
	}

	private _endResize(): void {
		if (this._resizeRaf !== null) {
			cancelAnimationFrame(this._resizeRaf);
			this._resizeRaf = null;
			this._pendingSizes = null;
		}
		this.dragEnd.emit();
	}

	public updatePanelStyles(): void {
		const panels = this.panels();
		const sizes = this.layout();

		panels.forEach((panel, index) => {
			const size = sizes[index];
			if (size !== undefined) {
				panel.setSize(size);
			}
		});
		// Keyboard resizing writes to the public model directly, so capture the applied value here as well.
		this._appliedLayout = [...sizes];
	}

	private _getEventPosition(event: MouseEvent | TouchEvent): number {
		const layout = this.direction();
		if (event instanceof MouseEvent) {
			return layout === 'vertical' ? event.clientY : event.clientX;
		} else {
			const touch = event.touches[0];
			return layout === 'vertical' ? touch.clientY : touch.clientX;
		}
	}

	private _getContainerSize(): number {
		const element = this._el.nativeElement as HTMLElement;
		const layout = this.direction();
		return layout === 'vertical' ? element.offsetHeight : element.offsetWidth;
	}

	public collapsePanel(index: number): void {
		const panels = this.panels();
		const panel = panels[index];

		if (!panel || !panel.collapsible()) return;

		const sizes = [...this.layout()];
		const isCollapsed = sizes[index] === 0;

		if (isCollapsed) {
			const panelDefaultSize = panel.defaultSize();
			const defaultSize = panelDefaultSize !== undefined ? panelDefaultSize / panels.length : 100 / panels.length;
			sizes[index] = defaultSize;

			const totalOthers = sizes.reduce((sum, size, i) => (i !== index ? sum + size : sum), 0);
			const scale = (100 - defaultSize) / totalOthers;

			sizes.forEach((size, i) => {
				if (i !== index) {
					sizes[i] = size * scale;
				}
			});
		} else {
			const collapsedSize = sizes[index];
			sizes[index] = 0;

			const totalOthers = sizes.reduce((sum, size, i) => (i !== index ? sum + size : sum), 0);
			const scale = (totalOthers + collapsedSize) / totalOthers;

			sizes.forEach((size, i) => {
				if (i !== index) {
					sizes[i] = size * scale;
				}
			});
		}

		this._setLayout(sizes);
		this.updatePanelStyles();
	}

	private _setLayout(sizes: number[]): void {
		this._appliedLayout = [...sizes];
		this.layout.set(sizes);
		this.layoutChanged.emit(sizes);
	}
}
