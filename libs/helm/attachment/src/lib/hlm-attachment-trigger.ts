import { computed, Directive, ElementRef, inject, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmAttachmentTrigger],a[hlmAttachmentTrigger]',
	host: {
		'data-slot': 'attachment-trigger',
		'[attr.type]': '_hostType()',
	},
})
export class HlmAttachmentTrigger {
	private readonly _elementRef = inject(ElementRef<HTMLElement>);

	public readonly type = input<'button' | 'submit' | 'reset' | null>('button');

	protected readonly _hostType = computed(() =>
		this._elementRef.nativeElement.localName === 'button' ? this.type() : null,
	);

	constructor() {
		classes(() => 'spartan-attachment-trigger cursor-pointer');
	}
}
