import {
	Directive,
	effect,
	type EmbeddedViewRef,
	inject,
	type OnDestroy,
	Renderer2,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { injectBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSliderTick]',
	host: {
		'data-slot': 'slider-tick',
	},
})
export class BrnSliderTick implements OnDestroy {
	private readonly _slider = injectBrnSlider();
	private readonly _templateRef = inject<TemplateRef<BrnSliderTickContext>>(TemplateRef);
	private readonly _renderer = inject(Renderer2);
	private readonly _viewContainer = inject(ViewContainerRef);
	private _ticks: EmbeddedViewRef<BrnSliderTickContext>[] = [];

	constructor() {
		effect(() => {
			const ticks = this._slider.ticks();
			const tickLabelInterval = this._slider.tickLabelInterval();

			// Remove any existing ticks
			this._ticks.forEach((tick) => this._viewContainer.remove(this._viewContainer.indexOf(tick)));

			// Create new ticks
			this._ticks = [];

			ticks.forEach((tick, index) => {
				const view = this._viewContainer.createEmbeddedView(this._templateRef, {
					$implicit: tick,
					index,
					formattedTick: this._slider.formatTick()(tick),
				});

				const tickEl = view.rootNodes[0] as HTMLElement;
				if (tickLabelInterval === 0 || index % tickLabelInterval !== 0) {
					this._renderer.setAttribute(tickEl, 'data-skip', '');
				}

				this._ticks.push(view);
			});
		});
	}

	ngOnDestroy(): void {
		this._ticks.forEach((tick) => this._viewContainer.remove(this._viewContainer.indexOf(tick)));
	}
}

interface BrnSliderTickContext {
	$implicit: number;
	index: number;
	formattedTick: string;
}
