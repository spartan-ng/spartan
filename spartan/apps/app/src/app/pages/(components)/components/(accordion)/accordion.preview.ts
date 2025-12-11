import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-accordion-preview',
	imports: [HlmAccordionImports, NgIcon, HlmIconImports],
	host: {
		class: 'max-w-lg block h-[250px]',
	},
	template: `
		<hlm-accordion>
			<hlm-accordion-item>
				<h3 class="contents">
					<button hlmAccordionTrigger>
						Product Information
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
				</h3>
				<hlm-accordion-content>
					<p>
						Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it
						offers unparalleled performance and reliability.
					</p>

					<p>
						Key features include advanced processing capabilities, and an intuitive user interface designed for both
						beginners and experts.
					</p>
				</hlm-accordion-content>
			</hlm-accordion-item>

			<hlm-accordion-item>
				<h3 class="contents">
					<button hlmAccordionTrigger>
						Shipping Details
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
				</h3>
				<hlm-accordion-content>
					<p>
						We offer worldwide shipping through trusted courier partners. Standard delivery takes 3-5 business days,
						while express shipping ensures delivery within 1-2 business days.
					</p>

					<p>
						All orders are carefully packaged and fully insured. Track your shipment in real-time through our dedicated
						tracking portal.
					</p>
				</hlm-accordion-content>
			</hlm-accordion-item>

			<hlm-accordion-item>
				<h3 class="contents">
					<button hlmAccordionTrigger>
						Return Policy
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
				</h3>
				<hlm-accordion-content>
					<p>
						We stand behind our products with a comprehensive 30-day return policy. If you're not completely satisfied,
						simply return the item in its original condition.
					</p>

					<p>
						Our hassle-free return process includes free return shipping and full refunds processed within 48 hours of
						receiving the returned item.
					</p>
				</hlm-accordion-content>
			</hlm-accordion-item>
		</hlm-accordion>
	`,
})
export class AccordionPreview {}

export const defaultImports = `
import { NgIcon } from '@ng-icons/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmIconImports } from '@spartan-ng/helm/icon';
`;

export const defaultSkeleton = `
<hlm-accordion>
	<hlm-accordion-item>
		<h3 class='contents'>
			<button hlmAccordionTrigger>
				Is it accessible?
				<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
			</button>
		</h3>
		<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
	</hlm-accordion-item>
</hlm-accordion>
`;
