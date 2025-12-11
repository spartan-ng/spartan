import {
	ChangeDetectionStrategy,
	Component,
	type InputSignal,
	type Signal,
	computed,
	input,
	signal,
	viewChild,
} from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import {
	EmblaCarouselDirective,
	type EmblaEventType,
	type EmblaOptionsType,
	type EmblaPluginType,
} from 'embla-carousel-angular';

@Component({
	selector: 'hlm-carousel',
	imports: [EmblaCarouselDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'carousel',
		'[class]': '_computedClass()',
		role: 'region',
		'aria-roledescription': 'carousel',
		'(keydown)': 'onKeydown($event)',
	},
	template: `
		<div
			emblaCarousel
			class="overflow-hidden"
			[plugins]="plugins()"
			[options]="_emblaOptions()"
			[subscribeToEvents]="['init', 'select', 'reInit']"
			(emblaChange)="onEmblaEvent($event)"
		>
			<ng-content select="[hlmCarouselContent],hlm-carousel-content" />
		</div>
		<ng-content />
	`,
})
export class HlmCarousel {
	protected readonly _emblaCarousel = viewChild.required(EmblaCarouselDirective);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('relative', this.userClass()));

	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
	public readonly options: InputSignal<Omit<EmblaOptionsType, 'axis'> | undefined> =
		input<Omit<EmblaOptionsType, 'axis'>>();
	public readonly plugins: InputSignal<EmblaPluginType[]> = input<EmblaPluginType[]>([]);

	protected readonly _emblaOptions: Signal<EmblaOptionsType> = computed(() => ({
		...this.options(),
		axis: this.orientation() === 'horizontal' ? 'x' : 'y',
	}));

	private readonly _canScrollPrev = signal(false);
	public readonly canScrollPrev = this._canScrollPrev.asReadonly();
	private readonly _canScrollNext = signal(false);
	public readonly canScrollNext = this._canScrollNext.asReadonly();

	private readonly _currentSlide = signal(0);
	public readonly currentSlide = this._currentSlide.asReadonly();
	private readonly _slideCount = signal(0);
	public readonly slideCount = this._slideCount.asReadonly();

	protected onEmblaEvent(event: EmblaEventType) {
		const emblaApi = this._emblaCarousel().emblaApi;

		if (!emblaApi) {
			return;
		}

		if (event === 'select' || event === 'init' || event === 'reInit') {
			this._canScrollPrev.set(emblaApi.canScrollPrev());
			this._canScrollNext.set(emblaApi.canScrollNext());

			this._currentSlide.set(emblaApi.selectedScrollSnap());
			this._slideCount.set(emblaApi.scrollSnapList().length);
		}
	}

	protected onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			this._emblaCarousel().scrollPrev();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			this._emblaCarousel().scrollNext();
		}
	}

	scrollPrev() {
		this._emblaCarousel().scrollPrev();
	}

	scrollNext() {
		this._emblaCarousel().scrollNext();
	}
}
