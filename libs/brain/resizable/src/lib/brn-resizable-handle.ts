import { type BooleanInput } from '@angular/cdk/coercion';
import { afterNextRender, booleanAttribute, computed, Directive, ElementRef, inject, input } from '@angular/core';
import { BrnResizableGroup } from './brn-resizable-group';

@Directive({
	selector: 'brn-resizable-handle, [brnResizeHandle]',
	exportAs: 'brnResizableHandle',
	host: {
		'[attr.data-layout]': '_layout()',
		'[attr.tabindex]': 'disabled() ? null : 0',
		'[attr.role]': '"separator"',
		'[attr.data-panel-group-direction]': '_direction()',
		'[attr.aria-orientation]': '_layout() === "vertical" ? "horizontal" : "vertical"',
		'[attr.aria-disabled]': 'disabled()',
		'(mousedown)': '_handleMouseDown($event)',
		'(keydown)': '_handleKeyDown($event)',
	},
})
export class BrnResizableHandle {
	/** Parent resizable group. */
	private readonly _resizable = inject(BrnResizableGroup);

	/** Host element reference. */
	private readonly _el = inject(ElementRef<HTMLElement>);

	/** Whether a visual handle is rendered inside the separator. */
	public readonly withHandle = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Whether the handle is disabled (not interactive). */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** The direction of the resizable group (`horizontal` or `vertical`). */
	protected readonly _direction = this._resizable.direction;

	/** Computed layout orientation based on the parent group. */
	protected readonly _layout = computed(() => this._resizable?.direction() || 'horizontal');

	/** Index of this handle relative to panels in the group. */
	private _handleIndex = 0;

	constructor() {
		afterNextRender(() => {
			this._handleIndex = this._getHandleIndex();
		});
	}

	private _getHandleIndex(): number {
		const host = this._el.nativeElement;
		const parent = host.parentElement;
		if (!parent) return -1;

		// Collect all panels under this group
		const panels = Array.from(parent.querySelectorAll('[data-slot="resizable-panel"]'));

		// Find the previous panel (the closest one before this handle)
		const prevPanel = host.previousElementSibling;
		if (!prevPanel) return -1;

		// Return its index among all panels
		return panels.indexOf(prevPanel as HTMLElement);
	}

	protected _handleMouseDown(event: MouseEvent): void {
		if (this.disabled() || !this._resizable) return;
		this._resizable.startResize(this._handleIndex, event);
	}

	protected _handleKeyDown(event: KeyboardEvent): void {
		if (this.disabled()) return;

		const panels = this._resizable.panels();
		const handleIndex = this._handleIndex;
		const layout = this._layout();

		let delta = 0;
		const step = event.shiftKey ? 10 : 1;

		switch (event.key) {
			case 'ArrowLeft':
				if (layout === 'horizontal') delta = -step;
				break;
			case 'ArrowRight':
				if (layout === 'horizontal') delta = step;
				break;
			case 'ArrowUp':
				if (layout === 'vertical') delta = -step;
				break;
			case 'ArrowDown':
				if (layout === 'vertical') delta = step;
				break;
			case 'Home':
				event.preventDefault();
				this._moveToExtreme(true);
				return;
			case 'End':
				event.preventDefault();
				this._moveToExtreme(false);
				return;
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (panels[handleIndex]?.collapsible() || panels[handleIndex + 1]?.collapsible()) {
					const collapsibleIndex = panels[handleIndex]?.collapsible() ? handleIndex : handleIndex + 1;
					this._resizable.collapsePanel(collapsibleIndex);
				}
				return;
			default:
				return;
		}

		if (delta !== 0) {
			event.preventDefault();
			this._adjustSizes(delta);
		}
	}

	private _getPanelContext() {
		const panels = this._resizable.panels();
		const li = this._handleIndex;
		const ri = li + 1;

		const left = panels[li];
		const right = panels[ri];
		if (!left || !right) return null;

		const sizes = [...this._resizable.layout()];

		return {
			sizes,
			li,
			ri,
			left,
			right,
			leftMin: left.minSize(),
			leftMax: left.maxSize(),
			rightMin: right.minSize(),
			rightMax: right.maxSize(),
		};
	}

	private _adjustSizes(delta: number): void {
		const ctx = this._getPanelContext();
		if (!ctx) return;

		let newLeftSize = ctx.sizes[ctx.li] + delta;
		let newRightSize = ctx.sizes[ctx.ri] - delta;

		newLeftSize = Math.max(ctx.leftMin, Math.min(ctx.leftMax, newLeftSize));
		newRightSize = Math.max(ctx.rightMin, Math.min(ctx.rightMax, newRightSize));

		const totalSize = newLeftSize + newRightSize;
		const originalTotal = ctx.sizes[ctx.li] + ctx.sizes[ctx.ri];

		if (Math.abs(totalSize - originalTotal) < 0.01) {
			ctx.sizes[ctx.li] = newLeftSize;
			ctx.sizes[ctx.ri] = newRightSize;

			this._resizable.layout.set(ctx.sizes);
			this._resizable.updatePanelStyles();
		}
	}

	private _moveToExtreme(toMin: boolean): void {
		const ctx = this._getPanelContext();
		if (!ctx) return;

		const totalSize = ctx.sizes[ctx.li] + ctx.sizes[ctx.ri];

		if (toMin) {
			ctx.sizes[ctx.li] = ctx.leftMin;
			ctx.sizes[ctx.ri] = Math.min(totalSize - ctx.leftMin, ctx.rightMax);
		} else {
			ctx.sizes[ctx.li] = Math.min(totalSize - ctx.rightMin, ctx.leftMax);
			ctx.sizes[ctx.ri] = ctx.rightMin;
		}

		this._resizable.layout.set(ctx.sizes);
		this._resizable.updatePanelStyles();
	}
}
