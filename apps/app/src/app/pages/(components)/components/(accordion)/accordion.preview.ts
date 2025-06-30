import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
	HlmAccordionContentComponent,
	HlmAccordionDirective,
	HlmAccordionIconDirective,
	HlmAccordionItemDirective,
	HlmAccordionTriggerDirective,
} from '@spartan-ng/helm/accordion';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-accordion-preview',
	imports: [
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionIconDirective,
		HlmAccordionContentComponent,
		NgIcon,
		HlmIconDirective,
	],
	template: `
		<div hlmAccordion>
			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Product Information
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it
					offers unparalleled performance and reliability.

					<br />
					<br />

					Key features include advanced processing capabilities, and an intuitive user interface designed for both
					beginners and experts.
				</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Shipping Details
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					We offer worldwide shipping through trusted courier partners. Standard delivery takes 3-5 business days, while
					express shipping ensures delivery within 1-2 business days.

					<br />
					<br />
					All orders are carefully packaged and fully insured. Track your shipment in real-time through our dedicated
					tracking portal.
				</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Return Policy
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					We stand behind our products with a comprehensive 30-day return policy. If you're not completely satisfied,
					simply return the item in its original condition.
					<br />
					<br />
					Our hassle-free return process includes free return shipping and full refunds processed within 48 hours of
					receiving the returned item.
				</hlm-accordion-content>
			</div>
		</div>
	`,
})
export class AccordionPreviewComponent {}

export const defaultImports = `
import { NgIcon } from '@ng-icons/core';
import {
  HlmAccordionContentComponent,
  HlmAccordionDirective,
  HlmAccordionIconDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/helm/accordion';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
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
