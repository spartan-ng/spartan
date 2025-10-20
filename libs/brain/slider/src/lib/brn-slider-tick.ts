import {
	Directive,
	effect,
	type EmbeddedViewRef,
	inject,
	type OnDestroy,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { injectBrnSlider } from './brn-slider.token';

@Directive({
	selector: '[brnSliderTick]',
})
export class BrnSliderTick implements OnDestroy {
	private readonly _slider = injectBrnSlider();
	private readonly _templateRef = inject<TemplateRef<BrnSliderTickContext>>(TemplateRef);
	private readonly _viewContainer = inject(ViewContainerRef);
	private _ticks: EmbeddedViewRef<BrnSliderTickContext>[] = [];

	constructor() {
		effect(() => {
			const ticks = this._slider.ticks();

			// remove any existing ticks
			this._ticks.forEach((tick) => this._viewContainer.remove(this._viewContainer.indexOf(tick)));

			// create new ticks
			this._ticks = [];

			ticks.forEach((tick, index) => {
				const view = this._viewContainer.createEmbeddedView(this._templateRef, {
					$implicit: tick,
					index,
					position: (index / (ticks.length - 1)) * 100,
				});
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
	position: number;
}
