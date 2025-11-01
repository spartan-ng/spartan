import { Component, signal, type TemplateRef } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';

export const pageNavTmpl = signal<TemplateRef<unknown> | null>(null);

@Component({
	selector: 'spartan-page-nav-zerops-ad',
	imports: [HlmButton],
	host: {
		class: `group bg-surface text-surface-foreground relative flex flex-col gap-2 rounded-lg p-6 text-sm`,
	},
	template: `
		<div class="text-base leading-tight font-semibold text-balance group-hover:underline">
			Stop configuring. Start shipping.
		</div>
		<div class="text-muted-foreground">Zerops powers spartan.ng and Angular teams worldwide.</div>
		<div class="text-muted-foreground">One-command deployment. Zero infrastructure headaches.</div>
		<button hlmBtn class="w-fit">Deploy with Zerops</button>
		<a class="absolute top-0 right-0 bottom-0 left-0" href="https://zerops.io" target="_blank" rel="noreferrer">
			<span class="sr-only">Deploy with Zerops</span>
		</a>
	`,
})
export class PageNavZeropsAd {}
