import { afterNextRender, contentChildren, Directive, ElementRef, inject, input, model, output } from '@angular/core';
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
	public readonly id = input<string>(`brn-resizable-group-${++nextId}`);

	private readonly _el = inject(ElementRef<HTMLElement>);

	public readonly direction = input<'horizontal' | 'vertical'>('horizontal');

	public readonly panels = contentChildren(BrnResizablePanel);

	public readonly dragStart = output<void>();
	public readonly dragEnd = output<void>();

	/** Resize panel group to the specified layout ([1 - 100, ...]). */
	public readonly layout = model<number[]>([]);

	/** Called when group layout changes */
	public readonly layoutChange = output<number[]>();

	constructor() {
		afterNextRender(() => {
			this.initializePanelSizes();
		});
	}

	private initializePanelSizes(): void {
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

		this._setLayout(sizes);
	}

	startResize(handleIndex: number, event: MouseEvent | TouchEvent): void {
		event.preventDefault();

		const sizes = [...this.layout()];
		this.dragStart.emit();

		const startPosition = this.getEventPosition(event);
		const startSizes = [...sizes];

		const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
			this.handleResize(moveEvent, handleIndex, startPosition, startSizes);
		};

		const handleEnd = () => {
			this.endResize();
			document.removeEventListener('mousemove', handleMove);
			document.removeEventListener('touchmove', handleMove);
			document.removeEventListener('mouseup', handleEnd);
			document.removeEventListener('touchend', handleEnd);
		};

		document.addEventListener('mousemove', handleMove);
		document.addEventListener('touchmove', handleMove);
		document.addEventListener('mouseup', handleEnd);
		document.addEventListener('touchend', handleEnd);
	}

	private handleResize(
		event: MouseEvent | TouchEvent,
		handleIndex: number,
		startPosition: number,
		startSizes: number[],
	): void {
		const currentPosition = this.getEventPosition(event);
		const delta = currentPosition - startPosition;
		const containerSize = this.getContainerSize();
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

			this._setLayout(newSizes);

			this.updatePanelStyles();

			// this.zResize.emit({ sizes: newSizes, layout: this.zLayout() || 'horizontal' });
		}
	}

	private endResize(): void {
		this.dragEnd.emit();
	}

	updatePanelStyles(): void {
		const panels = this.panels();
		const sizes = this.layout();

		panels.forEach((panel, index) => {
			const size = sizes[index];
			if (size !== undefined) {
				panel.setSize(size);
			}
		});
	}

	private getEventPosition(event: MouseEvent | TouchEvent): number {
		const layout = this.direction();
		if (event instanceof MouseEvent) {
			return layout === 'vertical' ? event.clientY : event.clientX;
		} else {
			const touch = event.touches[0];
			return layout === 'vertical' ? touch.clientY : touch.clientX;
		}
	}

	getContainerSize(): number {
		const element = this._el.nativeElement as HTMLElement;
		const layout = this.direction();
		return layout === 'vertical' ? element.offsetHeight : element.offsetWidth;
	}

	collapsePanel(index: number): void {
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
		this.layoutChange.emit(sizes);
	}
}
