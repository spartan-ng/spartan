import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-accordion-card',
	imports: [HlmAccordionImports, HlmIconImports, HlmCardImports, NgIcon],
	host: {
		class: 'max-w-lg h-[32rem] md:h-[28rem] flex flex-col justify-between',
	},
	template: `
		<hlm-card class="w-full max-w-sm">
			<hlm-card-header>
				<h3 hlmCardTitle>Subscription & Billing</h3>
				<p hlmCardDescription>Common questions about your account, plans, payments and cancellations.</p>
			</hlm-card-header>
			<div hlmCardContent>
				<hlm-accordion>
					@for (item of items; track $index) {
						<hlm-accordion-item>
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
			</div>
		</hlm-card>
	`,
})
export class AccordionCard {
	public items = [
		{
			value: 'plans',
			trigger: 'What subscription plans do you offer?',
			content:
				'We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month). Each plan includes increasing storage limits, API access, priority support, and team collaboration features.',
		},
		{
			value: 'billing',
			trigger: 'How does billing work?',
			content:
				"Billing occurs automatically at the start of each billing cycle. We accept all major credit cards, PayPal, and ACH transfers for enterprise customers. You'll receive an invoice via email after each payment.",
		},
		{
			value: 'cancel',
			trigger: 'How do I cancel my subscription?',
			content:
				'You can cancel your subscription anytime from your account settings. There are no cancellation fees or penalties. Your access will continue until the end of your current billing period.',
		},
	];
}
