import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnAccordionDirective, BrnAccordionImports } from '@spartan-ng/brain/accordion';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmIconDirective } from '../icon/helm/src';
import { HlmAccordionImports } from './helm/src';

const meta: Meta<BrnAccordionDirective> = {
	title: 'Accordion',
	component: BrnAccordionDirective,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [BrnAccordionImports, HlmAccordionImports, NgIcon, HlmIconDirective, HlmInputDirective],
			providers: [provideIcons({ lucideChevronDown })],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnAccordionDirective>;

export const Default: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is it accessible?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is it styled?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is it animated?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						Yes. It's animated by default, but you can disable it if you prefer.
					</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
};

export const TwoAccordions: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is it accessible?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is it styled?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is it animated?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						Yes. It's animated by default, but you can disable it if you prefer.
					</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>

			<hlm-accordion>
				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is it accessible?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is it styled?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is it styled?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is it styled?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
};
export const SetOpenState: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion [type]="multiple">
				<hlm-accordion-item isOpened>
					<button hlmAccordionTrigger>
						Is it accessible?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is it styled?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item isOpened>
					<button hlmAccordionTrigger>
						Is it animated?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						Yes. It's animated by default, but you can disable it if you prefer.
					</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
};
export const WithTapable: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is the button tapable when closed?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						<button data-testid="not-tapable-when-closed">It should not be when closed</button>
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Is the button tapable when open?
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						<button data-testid="tapable-when-open">It should be when open</button>
					</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
};

export const AccordionWithInput: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<button hlmAccordionTrigger>
						Enter your name
						<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
					</button>
					<hlm-accordion-content>
						<div class="px-1">
							<input type="text" placeholder="Type your name here" hlmInput />
						</div>
					</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
};
