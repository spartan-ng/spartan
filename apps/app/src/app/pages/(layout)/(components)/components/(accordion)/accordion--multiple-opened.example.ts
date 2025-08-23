import { Component, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
	HlmAccordion,
	HlmAccordionContent,
	HlmAccordionIcon,
	HlmAccordionItem,
	HlmAccordionTrigger,
} from '@spartan-ng/helm/accordion';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-accordion-multiple-opened',
	imports: [
		HlmButton,
		HlmAccordion,
		HlmAccordionItem,
		HlmAccordionTrigger,
		HlmAccordionContent,
		HlmAccordionIcon,
		NgIcon,
		HlmIcon,
	],
	template: `
		<div hlmAccordion type="multiple" class="pb-4">
			<div hlmAccordionItem [isOpened]="true">
				<button hlmAccordionTrigger>
					Is it accessible?
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it styled?
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It comes with default styles that match the other components' aesthetics.
				</hlm-accordion-content>
			</div>

			<div hlmAccordionItem [isOpened]="_thirdOpened()">
				<button hlmAccordionTrigger>
					Is it animated?
					<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It's animated by default, but you can disable it if you prefer.
				</hlm-accordion-content>
			</div>
		</div>
		<button hlmBtn (click)="toggleThird()">Toggle Third Item</button>
	`,
})
export class AccordionMultipleOpened {
	protected readonly _thirdOpened = signal(false);
	toggleThird() {
		this._thirdOpened.set(!this._thirdOpened());
	}
}
