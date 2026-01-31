import { isPlatformServer } from '@angular/common';
import {
	afterNextRender,
	computed,
	DestroyRef,
	Directive,
	ElementRef,
	inject,
	Injector,
	OnDestroy,
	PLATFORM_ID,
	runInInjectionContext,
	signal,
	Signal,
} from '@angular/core';
import { injectBrnSlider } from './brn-slider.token';
import { linearScale } from './utils/linear-scale';

@Directive({
	selector: '[brnSliderThumb]',
	host: {
		role: 'slider',
		'[attr.aria-label]': `_ariaLabel`,
		'[attr.aria-valuenow]': '_slider.value()[_index()]',
		'[attr.aria-valuemin]': '_slider.min()',
		'[attr.aria-valuemax]': '_slider.max()',
		'[attr.tabindex]': '_slider.mutableDisabled() ? -1 : 0',
		'[attr.data-disabled]': '_slider.mutableDisabled()',
		'[style.inset-inline-start]': '_thumbOffset()',
		'[style.visibility]': '_thumbReady() ? undefined : "hidden"',
		'[style.pointer-events]': '_thumbReady() ? undefined : "none"',
		'[style.transform]': "'translateX(-50%)'",
		'data-slot': 'slider-thumb',
		'(pointerdown)': '_onPointerDown($event)',
		'(pointermove)': '_onPointerMove($event)',
		'(pointerup)': '_onPointerUp($event)',
		'(keydown)': 'handleKeydown($event)',
	},
})
export class BrnSliderThumb implements OnDestroy {
	private readonly _platform = inject(PLATFORM_ID);
	protected readonly _slider = injectBrnSlider();
	private readonly _size = injectElementSize();
	public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	protected readonly _thumbReady = computed(() => {
		const size = this._size();
		return !!size && size.width > 0;
	});

	private readonly _dir = this._slider.direction;

	protected readonly _index = computed(() => this._slider.thumbs().findIndex((thumb) => thumb === this));

	public readonly percentage = computed(
		() =>
			((this._slider.value()[this._index()] - this._slider.min()) / (this._slider.max() - this._slider.min())) * 100,
	);

	public readonly thumbInBoundsOffset = computed(() => {
		// we can't compute the offset on the server
		if (isPlatformServer(this._platform)) {
			return 0;
		}

		const width = this._size()?.width;
		if (!width) {
			return 0;
		}

		const halfWidth = width / 2;

		const offset = linearScale([0, 50], [0, halfWidth]);

		const direction = this._dir() === 'ltr' ? 1 : -1;

		return (halfWidth - offset(this.percentage()) * direction) * direction;
	});

	/**
	 * Offsets the thumb centre point while sliding to ensure it remains
	 * within the bounds of the slider when reaching the edges.
	 * Based on https://github.com/radix-ui/primitives/blob/main/packages/react/slider/src/slider.tsx
	 */
	public readonly _thumbOffset = computed(() => {
		// we can't compute the offset on the server
		if (isPlatformServer(this._platform)) {
			return this.percentage() + '%';
		}

		return `calc(${this.percentage()}% + ${this.thumbInBoundsOffset()}px)`;
	});

	public readonly _thumbOffsetInverted = computed(() => {
		// we can't compute the offset on the server
		if (isPlatformServer(this._platform)) {
			return 100 - this.percentage() + '%';
		}

		return `calc(${100 - this.percentage()}% - ${this.thumbInBoundsOffset()}px)`;
	});

	protected readonly _ariaLabel = computed(() => `Value ${this._index() + 1} of ${this._slider.value().length}`);

	constructor() {
		this._slider.addThumb(this);
	}

	ngOnDestroy() {
		this._slider.removeThumb(this);
	}

	_onPointerDown(event: PointerEvent) {
		this._slider.track()?._onPointerDown(event);
	}

	_onPointerMove(event: PointerEvent) {
		this._slider.track()?._onPointerMove(event);
	}

	_onPointerUp(event: PointerEvent) {
		this._slider.track()?._onPointerUp(event);
	}

	/**
	 * Handle keyboard events.
	 * @param event
	 */
	protected handleKeydown(event: KeyboardEvent) {
		const dir = this._slider.direction();
		let multiplier = event.shiftKey ? 10 : 1;
		const index = this._index();
		const value = this._slider.value()[index];

		// if the slider is RTL, flip the multiplier
		if (dir === 'rtl') {
			multiplier = event.shiftKey ? -10 : -1;
		}

		switch (event.key) {
			case 'ArrowLeft':
				this._slider.setValue(Math.max(value - this._slider.step() * multiplier, this._slider.min()), index);
				event.preventDefault();
				break;
			case 'ArrowRight':
				this._slider.setValue(Math.min(value + this._slider.step() * multiplier, this._slider.max()), index);
				event.preventDefault();
				break;
			case 'Home':
				this._slider.setValue(this._slider.min(), index);
				event.preventDefault();
				break;
			case 'End':
				this._slider.setValue(this._slider.max(), index);
				event.preventDefault();
				break;
		}
	}
}

export function injectElementSize(
	options: ElementSizeOptions = {},
): Signal<{ width: number; height: number } | undefined> {
	return runInInjectionContext(options.injector ?? inject(Injector), () => {
		const elementRef = options.elementRef ?? inject(ElementRef);
		const platformId = inject(PLATFORM_ID);
		const destroyRef = inject(DestroyRef);

		const element = elementRef.nativeElement;

		const size = signal<{ width: number; height: number } | undefined>(undefined);

		if (isPlatformServer(platformId)) {
			return size;
		}

		afterNextRender({
			read: () => {
				size.set({
					width: element.offsetWidth,
					height: element.offsetHeight,
				});

				const ro = new ResizeObserver((entries) => {
					if (!entries.length) return;

					const entry = entries[0];

					if ('borderBoxSize' in entry) {
						const borderSize = Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize;

						size.set({
							width: borderSize.inlineSize,
							height: borderSize.blockSize,
						});
					} else {
						size.set({
							width: element.offsetWidth,
							height: element.offsetHeight,
						});
					}
				});

				ro.observe(element, { box: 'border-box' });

				destroyRef.onDestroy(() => {
					ro.disconnect();
				});
			},
		});

		return size;
	});
}

interface ElementSizeOptions {
	elementRef?: ElementRef<HTMLElement>;
	injector?: Injector;
}
