import { Component } from '@angular/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';

@Component({
	selector: 'spartan-accordion-multiple',
	imports: [HlmAccordionImports],
	host: {
		class: 'max-w-sm h-[380px] flex flex-col justify-between',
	},
	template: `
		<hlm-accordion type="multiple">
			@for (item of items; track item.value; let i = $index) {
				<hlm-accordion-item [isOpened]="i === 0">
					<hlm-accordion-trigger>{{ item.trigger }}</hlm-accordion-trigger>
					<hlm-accordion-content>{{ item.content }}</hlm-accordion-content>
				</hlm-accordion-item>
			}
		</hlm-accordion>
	`,
})
export class AccordionMultiple {
	public items = [
		{
			value: 'notifications',
			trigger: 'Notification Settings',
			content:
				'Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.',
		},
		{
			value: 'privacy',
			trigger: 'Privacy & Security',
			content:
				'Control your privacy settings and security preferences. Enable two-factor authentication, manage connected devices, review active sessions, and configure data sharing preferences. You can also download your data or delete your account.',
		},
		{
			value: 'billing',
			trigger: 'Billing & Subscription',
			content:
				'View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.',
		},
	];
}
