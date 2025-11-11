import {
	afterNextRender,
	contentChildren,
	Directive,
	DOCUMENT,
	ElementRef,
	inject,
	input,
	model,
	NgZone,
	output,
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

	constructor() {
		afterNextRender(() => {
			this._initializePanelSizes();
		});
	}

	private _initializePanelSizes(): void {
		const panels = this.panels();
		const totalPanels = panels.length;

		if (totalPanels === 0) return;

		const sizes: number[] = [];

		panels.forEach((panel, index) => {
			const defaultSize = panel.defaultSize() ?? this.layout()[index];
			const size = defaultSize !== undefined ? defaultSize : 100 / totalPanels;
			sizes.push(size);
			panel.setSize(size);
		});

		if (this.layout().toString() !== sizes.toString()) {
			this._setLayout(sizes);
		}
	}

	public startResize(handleIndex: number, event: MouseEvent | TouchEvent): void {
		event.preventDefault();

		const cursor = this.direction() === 'vertical' ? 'row-resize' : 'col-resize';
		this._document.body.style.cursor = `${cursor}`;
		const sizes = [...this.layout()];
		this.dragStart.emit();

		const startPosition = this._getEventPosition(event);
		const startSizes = [...sizes];

		const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
			this._zone.runOutsideAngular(() => {
				this._handleResize(moveEvent, handleIndex, startPosition, startSizes);
			});
		};

		const handleEnd = () => {
			this._zone.run(() => this._endResize());

			this._document.body.style.cursor = 'default';
			this._document.removeEventListener('mousemove', handleMove);
			this._document.removeEventListener('touchmove', handleMove);
			this._document.removeEventListener('mouseup', handleEnd);
			this._document.removeEventListener('touchend', handleEnd);
		};

		this._zone.runOutsideAngular(() => {
			this._document.addEventListener('mousemove', handleMove);
			this._document.addEventListener('touchmove', handleMove);
			this._document.addEventListener('mouseup', handleEnd);
			this._document.addEventListener('touchend', handleEnd);
		});
	}

	private _handleResize(
		event: MouseEvent | TouchEvent,
		handleIndex: number,
		startPosition: number,
		startSizes: number[],
	): void {
		const currentPosition = this._getEventPosition(event);
		const delta = currentPosition - startPosition;
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
		this.layout.set(sizes);
		this.layoutChanged.emit(sizes);
	}
}
