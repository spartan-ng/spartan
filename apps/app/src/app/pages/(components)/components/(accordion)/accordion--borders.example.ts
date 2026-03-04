import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-accordion-borders',
	imports: [HlmAccordionImports, HlmIconImports, NgIcon],
	host: {
		class: 'max-w-lg h-[320px] flex flex-col justify-between',
	},
	template: `
		<hlm-accordion class="rounded-lg border">
			@for (item of items; track $index) {
				<hlm-accordion-item class="border-b px-4 last:border-b-0">
					<h3 class="contents">
						<button hlmAccordionTrigger>
							{{ item.trigger }}
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
					<hlm-accordion-content>{{ item.content }}</hlm-accordion-content>
				</hlm-accordion-item>
			}
		</hlm-accordion>
	`,
})
export class AccordionBorders {
	public items = [
		{
			value: 'billing',
			trigger: 'How does billing work?',
			content:
				'We offer monthly and annual subscription plans. Billing is charged at the beginning of each cycle, and you can cancel anytime. All plans include automatic backups, 24/7 support, and unlimited team members.',
		},
		{
			value: 'security',
			trigger: 'Is my data secure?',
			content:
				'Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits. All data is encrypted at rest and in transit using industry-standard protocols.',
		},
		{
			value: 'integration',
			trigger: 'What integrations do you support?',
			content:
				'We integrate with 500+ popular tools including Slack, Zapier, Salesforce, HubSpot, and more. You can also build custom integrations using our REST API and webhooks.',
		},
	];
}
