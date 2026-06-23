import { Component, signal } from '@angular/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-accordion-dynamic',
	imports: [HlmAccordionImports, HlmButtonImports],
	host: {
		class: 'block max-w-sm',
	},
	template: `
		<hlm-accordion>
			<hlm-accordion-item isOpened>
				<hlm-accordion-trigger>What's included in my plan?</hlm-accordion-trigger>
				<hlm-accordion-content>
					<p>Your plan includes analytics, alerts, and email support.</p>
					@if (showDetails()) {
						<ul class="mt-2 list-disc pl-4">
							<li>Priority support</li>
							<li>Custom dashboards</li>
							<li>Unlimited team seats</li>
						</ul>
					}
					<button hlmBtn size="sm" variant="outline" class="mt-3" (click)="showDetails.set(!showDetails())">
						{{ showDetails() ? 'Hide' : 'Show' }} details
					</button>
				</hlm-accordion-content>
			</hlm-accordion-item>
		</hlm-accordion>
	`,
})
export class AccordionDynamic {
	public readonly showDetails = signal(false);
}
