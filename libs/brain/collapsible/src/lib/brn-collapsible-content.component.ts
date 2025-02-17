import {
	type AfterContentInit,
	Component,
	ElementRef,
	computed,
	effect,
	inject,
	input,
	signal,
	untracked,
} from '@angular/core';
import { BrnCollapsibleComponent } from './brn-collapsible.component';

@Component({
	selector: 'brn-collapsible-content',
	standalone: true,
	host: {
		'[hidden]': 'state() === "closed"',
		'[attr.data-state]': 'state()',
		'[style]': 'computedStyles()',
		'[id]': 'contentId()',
	},
	template: `
		<ng-content />
	`,
})
export class BrnCollapsibleContentComponent implements AfterContentInit {
	private readonly _collapsible = inject(BrnCollapsibleComponent, { optional: true });

	private readonly _elementRef = inject(ElementRef);

	private readonly _height = signal(0);

	private readonly _width = signal(0);

	public readonly contentId = computed(() => this._collapsible?.contentId());

	public readonly state = computed(() => this._collapsible?.state?.() ?? 'closed');

	public readonly computedStyles = computed(() => {
		const height = this._height();
		const width = this._width();
		return {
			'--radix-collapsible-content-height': height ? `${height}px` : undefined,
			'--radix-collapsible-content-width': width ? `${width}px` : undefined,
		};
	});

	public readonly id = input<string | null | undefined>();

	constructor() {
		if (!this._collapsible) {
			throw Error('Collapsible trigger directive can only be used inside a brn-collapsible element.');
		}

		effect(() => {
			const id = this.id();
			const collapsible = this._collapsible;
			if (!id || !collapsible) return;
			untracked(() => collapsible.contentId.set(id));
		});
	}

	ngAfterContentInit() {
		if (typeof this._elementRef.nativeElement.getBoundingClientRect !== 'function') return;
		const rect = this._elementRef.nativeElement.getBoundingClientRect();
		if (!rect) return;
		this._width.set(rect.width);
		this._height.set(rect.height);
	}
}
