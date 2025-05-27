import { computed, Directive, effect, ElementRef, inject, input, untracked } from '@angular/core';
import { BrnTabsDirective } from './brn-tabs.directive';

@Directive({
	selector: '[brnTabsContent]',
	standalone: true,
	host: {
		role: 'tabpanel',
		tabindex: '0',
		'[id]': 'contentId()',
		'[attr.aria-labelledby]': 'labelId()',
		'[hidden]': '_isSelected() === false',
	},
	exportAs: 'brnTabsContent',
})
export class BrnTabsContentDirective {
	private readonly _root = inject(BrnTabsDirective);
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
}
