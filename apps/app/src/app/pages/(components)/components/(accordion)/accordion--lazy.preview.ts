import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';

@Component({
	selector: 'spartan-accordion-lazy',
	imports: [HlmAccordionImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block w-full max-w-sm',
	},
	template: `
		<hlm-accordion>
			<hlm-accordion-item>
				<hlm-accordion-trigger>Account</hlm-accordion-trigger>
				<hlm-accordion-content>
					<ng-template hlmAccordionContentLazy>
						<p>This content was lazily loaded when the item was first opened.</p>
					</ng-template>
				</hlm-accordion-content>
			</hlm-accordion-item>

			<hlm-accordion-item>
				<hlm-accordion-trigger>Password</hlm-accordion-trigger>
				<hlm-accordion-content>
					<ng-template hlmAccordionContentLazy>
						<p>This content was lazily loaded when the item was first opened.</p>
					</ng-template>
				</hlm-accordion-content>
			</hlm-accordion-item>
		</hlm-accordion>
	`,
})
export class AccordionLazy {}
