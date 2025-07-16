import { computed, Directive, effect, ElementRef, inject, input, OnDestroy, untracked } from '@angular/core';
import { BrnTabs } from './brn-tabs';

@Directive({
	selector: '[brnTabsContent]',
	host: {
		role: 'tabpanel',
		tabindex: '0',
		'[id]': 'contentId()',
		'[attr.aria-labelledby]': 'labelId()',
		'[hidden]': '_isSelected() === false',
	},
	exportAs: 'brnTabsContent',
})
export class BrnTabsContent implements OnDestroy {
	private readonly _root = inject(BrnTabs);
	private readonly _elementRef = inject(ElementRef);

	public readonly contentFor = input.required<string>({ alias: 'brnTabsContent' });
	protected readonly _isSelected = computed(() => this._root.$activeTab() === this.contentFor());
	protected contentId = computed(() => `brn-tabs-content-${this.contentFor()}`);
	protected labelId = computed(() => `brn-tabs-label-${this.contentFor()}`);

	constructor() {
		effect(() => {
			const contentFor = this.contentFor();
			untracked(() => this._root.registerContent(contentFor, this));
		});
	}

	public focus() {
		this._elementRef.nativeElement.focus();
	}

	ngOnDestroy(): void {
		this._root.unregisterContent(this.contentFor());
	}
}
