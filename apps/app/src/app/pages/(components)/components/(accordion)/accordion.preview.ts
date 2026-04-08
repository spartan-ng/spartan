import { Component } from '@angular/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';

@Component({
	selector: 'spartan-accordion-preview',
	imports: [HlmAccordionImports],
	host: {
		class: 'max-w-sm block h-[250px]',
	},
	template: `
		<hlm-accordion>
			<hlm-accordion-item>
				<hlm-accordion-trigger>What are your shipping options?</hlm-accordion-trigger>
				<hlm-accordion-content>
					<p>
						We offer standard (5-7 days), express (2-3 days), and overnight shipping. Free shipping on international
						orders.
					</p>
				</hlm-accordion-content>
			</hlm-accordion-item>

			<hlm-accordion-item>
				<hlm-accordion-trigger>What is your return policy?</hlm-accordion-trigger>
				<hlm-accordion-content>
					<p>
						Returns accepted within 30 days. Items must be unused and in original packaging. Refunds processed within
						5-7 business days.
					</p>
				</hlm-accordion-content>
			</hlm-accordion-item>

			<hlm-accordion-item>
				<hlm-accordion-trigger>Return Policy</hlm-accordion-trigger>
				<hlm-accordion-content>
					<p>Reach us via email, live chat, or phone. We respond within 24 hours during business days.</p>
				</hlm-accordion-content>
			</hlm-accordion-item>
		</hlm-accordion>
	`,
})
export class AccordionPreview {}

export const defaultImports = `
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
`;

export const defaultSkeleton = `
<hlm-accordion>
  <hlm-accordion-item>
    <hlm-accordion-trigger>Is it accessible?</hlm-accordion-trigger>
    <hlm-accordion-content> Yes. It adheres to the WAI-ARIA design pattern. </hlm-accordion-content>
  </hlm-accordion-item>
</hlm-accordion>
`;
