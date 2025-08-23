import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
	HlmAccordion,
	HlmAccordionContent,
	HlmAccordionIcon,
	HlmAccordionItem,
	HlmAccordionTrigger,
} from '@spartan-ng/helm/accordion';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-accordion-preview',
	imports: [
		HlmAccordion,
		HlmAccordionItem,
		HlmAccordionTrigger,
		HlmAccordionIcon,
		HlmAccordionContent,
		NgIcon,
		HlmIcon,
	],
	template: `
		<div hlmAccordion>
			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Product Information
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
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
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Shipping Details
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
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
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Return Policy
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
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
			</div>
		</div>
	`,
})
export class AccordionPreview {}

export const defaultImports = `
import { NgIcon } from '@ng-icons/core';
import {
  HlmAccordionContent
  HlmAccordion
  HlmAccordionIcon
  HlmAccordionItem
  HlmAccordionTrigger
} from '@spartan-ng/helm/accordion';
import { HlmIcon } from '@spartan-ng/helm/icon';
`;

export const defaultSkeleton = `
<div hlmAccordion>
	<div hlmAccordionItem>
		<button hlmAccordionTrigger>
			Is it accessible?
			<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
		</button>
		<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
	</div>
</div>
`;
