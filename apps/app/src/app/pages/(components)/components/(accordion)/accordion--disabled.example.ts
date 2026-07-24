import { Component } from '@angular/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';

@Component({
	selector: 'spartan-accordion-disabled',
	imports: [HlmAccordionImports],
	host: {
		class: 'max-w-sm h-[250px]',
	},
	template: `
		<hlm-accordion>
			<hlm-accordion-item>
				<hlm-accordion-trigger>Can I access my account history?</hlm-accordion-trigger>
				<hlm-accordion-content>
					Yes, you can view your complete account history including all transactions, plan changes, and support tickets
					in the Account History section of your dashboard.
				</hlm-accordion-content>
			</hlm-accordion-item>
			<hlm-accordion-item disabled>
				<hlm-accordion-trigger>Premium feature information</hlm-accordion-trigger>
				<hlm-accordion-content>
					This section contains information about premium features. Upgrade your plan to access this content.
				</hlm-accordion-content>
			</hlm-accordion-item>
			<hlm-accordion-item>
				<hlm-accordion-trigger>How do I update my email address?</hlm-accordion-trigger>
				<hlm-accordion-content>
					You can update your email address in your account settings. You'll receive a verification email at your new
					address to confirm the change.
				</hlm-accordion-content>
			</hlm-accordion-item>
		</hlm-accordion>
	`,
})
export class AccordionDisabled {}
