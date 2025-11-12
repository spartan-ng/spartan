import { NgTemplateOutlet } from '@angular/common';
import { Component, signal, type TemplateRef } from '@angular/core';

export const pageNavTmpl = signal<TemplateRef<unknown> | null>(null);

@Component({
	selector: 'spartan-page-nav-outlet',
	imports: [NgTemplateOutlet],
	host: {
		class: `sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--footer-height)+2rem-var(--stable-height))] w-72 flex-col gap-4 pb-8 xl:flex`,
	},
	template: `
		<ng-container [ngTemplateOutlet]="pageNavTmpl()" />
	`,
})
export class PageNavOutlet {
	public pageNavTmpl = pageNavTmpl.asReadonly();
}
