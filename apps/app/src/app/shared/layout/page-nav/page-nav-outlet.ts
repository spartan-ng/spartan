import { NgTemplateOutlet } from '@angular/common';
import { Component, signal, type TemplateRef } from '@angular/core';

export const pageNavTmpl = signal<TemplateRef<unknown> | null>(null);

@Component({
	selector: 'spartan-page-nav-outlet',
	host: {
		class: 'hidden xl:block text-[0.8rem] sticky top-14 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6',
	},
	template: `
		<ng-container [ngTemplateOutlet]="pageNavTmpl()" />
	`,
	imports: [NgTemplateOutlet],
})
export class PageNavOutlet {
	public pageNavTmpl = pageNavTmpl.asReadonly();
}
