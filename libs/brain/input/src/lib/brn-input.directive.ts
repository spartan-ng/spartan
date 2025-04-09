import { ChangeDetectorRef, Directive, inject } from '@angular/core';

@Directive({
	selector: '[brnInput]',
	standalone: true,
	host: {
		'[attr.aria-describedby]': 'ariaDescribedBy || null',
	},
})
export class BrnInputDirective {
	private readonly _cdRef = inject(ChangeDetectorRef);

	public ariaDescribedBy = '';

	public setAriaDescribedBy(ids: string) {
		this.ariaDescribedBy = ids;
		this._cdRef.markForCheck();
	}
}
