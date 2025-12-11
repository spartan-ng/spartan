import { Component, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-accordion-multiple-opened',
	imports: [HlmButtonImports, HlmAccordionImports, HlmIconImports, NgIcon],
	host: {
		class: 'max-w-lg h-[320px] flex flex-col justify-between',
	},
	template: `
		<hlm-accordion type="multiple" class="pb-4">
			<hlm-accordion-item [isOpened]="true">
				<h3 class="contents">
					<button hlmAccordionTrigger>
						Is it accessible?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
				</h3>
				<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
			</hlm-accordion-item>

			<hlm-accordion-item>
				<h3 class="contents">
					<button hlmAccordionTrigger>
						Is it styled?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
				</h3>
				<hlm-accordion-content>
					Yes. It comes with default styles that match the other components' aesthetics.
				</hlm-accordion-content>
			</hlm-accordion-item>

			<hlm-accordion-item (openedChange)="_thirdOpened.set($event)" [isOpened]="_thirdOpened()">
				<h3 class="contents">
					<button hlmAccordionTrigger>
						Is it animated?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
				</h3>
				<hlm-accordion-content>
					Yes. It's animated by default, but you can disable it if you prefer.
				</hlm-accordion-content>
			</hlm-accordion-item>
		</hlm-accordion>
		<button hlmBtn class="w-fit" (click)="toggleThird()">Toggle Third Item</button>
	`,
})
export class AccordionMultipleOpened {
	protected readonly _thirdOpened = signal(false);
	toggleThird() {
		this._thirdOpened.set(!this._thirdOpened());
	}
}
