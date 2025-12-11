import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { hlmMuted } from '@spartan-ng/helm/typography';

@Component({
	selector: 'spartan-footer',
	imports: [HlmButton],
	host: {
		class: 'block px-4 py-6',
	},
	template: `
		<footer class="${hlmMuted} mx-auto max-w-screen-xl text-center text-sm">
			Development powered by
			<a class="h-6 px-0.5 text-sm" hlmBtn href="https://zerops.io" target="_blank" variant="link">Zerops.</a>
			Open source and available on
			<a class="h-6 px-0.5 text-sm" hlmBtn href="https://github.com/spartan-ng/spartan" target="_blank" variant="link">
				GitHub.
			</a>
		</footer>
	`,
})
export class Footer {}
