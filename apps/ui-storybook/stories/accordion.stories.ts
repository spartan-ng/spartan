import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnAccordion, BrnAccordionImports } from '@spartan-ng/brain/accordion';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<BrnAccordion> = {
	title: 'Accordion',
	component: BrnAccordion,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [BrnAccordionImports, HlmAccordionImports, NgIcon, HlmIcon, HlmInput],
			providers: [provideIcons({ lucideChevronDown })],
		}),
	],
};
export default meta;
type Story = StoryObj<BrnAccordion>;

export const Default: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<hlm-accordion-trigger>Is it accessible?</hlm-accordion-trigger>
					<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Is it styled?</hlm-accordion-trigger>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Is it animated?</hlm-accordion-trigger>
					<hlm-accordion-content>
						Yes. It's animated by default, but you can disable it if you prefer.
					</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
};

export const Multiple: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion type="multiple">
				<hlm-accordion-item>
					<hlm-accordion-trigger>Can multiple panels be open?</hlm-accordion-trigger>
					<hlm-accordion-content>Yes. Set type="multiple" to allow multiple panels open.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Does it maintain state?</hlm-accordion-trigger>
					<hlm-accordion-content>
						Yes. Each panel maintains its own open/closed state independently.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Is it keyboard navigable?</hlm-accordion-trigger>
					<hlm-accordion-content>
						Yes. Full keyboard support with arrow keys, Home, End, Space, and Enter.
					</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
};

export const WithFormInputs: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<hlm-accordion-trigger>Form Controls Test</hlm-accordion-trigger>
					<hlm-accordion-content>
						<div class="space-y-4 p-4">
							<div>
								<label for="name-input" class="mb-1 block text-sm font-medium">Name Input</label>
								<input id="name-input" type="text" placeholder="Type your name" hlmInput />
							</div>

							<div>
								<label for="description-textarea" class="mb-1 block text-sm font-medium">Description</label>
								<textarea id="description-textarea" placeholder="Enter description" hlmInput rows="3"></textarea>
							</div>

							<div>
								<label for="option-select" class="mb-1 block text-sm font-medium">Select Option</label>
								<select id="option-select" hlmInput>
									<option>Option One</option>
									<option>Option Two</option>
									<option>Option Three</option>
								</select>
							</div>

							<div>
								<label class="mb-1 block text-sm font-medium">Content Editable</label>
								<div
									contenteditable="true"
									class="min-h-[2rem] rounded border p-2"
									role="textbox"
									aria-multiline="true"
								>
									Edit this text
								</div>
							</div>

							<div>
								<label class="mb-1 block text-sm font-medium">ARIA Textbox</label>
								<div role="textbox" tabindex="0" aria-multiline="true" class="rounded border p-2">ARIA textbox</div>
							</div>

							<div>
								<label class="mb-1 block text-sm font-medium">ARIA Combobox</label>
								<div role="combobox" tabindex="0" aria-expanded="false" class="rounded border p-2">ARIA combobox</div>
							</div>

							<div>
								<label class="mb-1 block text-sm font-medium">ARIA Listbox</label>
								<div role="listbox" tabindex="0" class="rounded border p-2">
									<div role="option" class="p-1">Option A</div>
									<div role="option" class="p-1">Option B</div>
								</div>
							</div>
						</div>
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Additional Panel</hlm-accordion-trigger>
					<hlm-accordion-content>This panel helps test navigation between triggers.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Third Panel</hlm-accordion-trigger>
					<hlm-accordion-content>Another panel for testing keyboard navigation.</hlm-accordion-content>
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
					<hlm-accordion-trigger>Is the button tapable when closed?</hlm-accordion-trigger>
					<hlm-accordion-content>
						<button data-testid="not-tapable-when-closed" class="rounded bg-blue-500 px-4 py-2 text-white">
							This button should not be focusable when panel is closed
						</button>
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Is the button tapable when open?</hlm-accordion-trigger>
					<hlm-accordion-content>
						<button data-testid="tapable-when-open" class="rounded bg-green-500 px-4 py-2 text-white">
							This button should be focusable when panel is open
						</button>
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
					<hlm-accordion-trigger>Is it an accessible accordion</hlm-accordion-trigger>
					<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Is it a styled accordion?</hlm-accordion-trigger>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Is it animated?</hlm-accordion-trigger>
					<hlm-accordion-content>
						Yes. It's animated by default, but you can disable it if you prefer.
					</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>

			<hlm-accordion>
				<hlm-accordion-item>
					<hlm-accordion-trigger>Is it accessible?</hlm-accordion-trigger>
					<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Is it styled?</hlm-accordion-trigger>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Is it nicely styled?</hlm-accordion-trigger>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Is it very nicely styled?</hlm-accordion-trigger>
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
			<hlm-accordion type="multiple">
				<hlm-accordion-item isOpened>
					<hlm-accordion-trigger>Is it accessible?</hlm-accordion-trigger>
					<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<hlm-accordion-trigger>Is it styled?</hlm-accordion-trigger>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item isOpened>
					<hlm-accordion-trigger>Is it animated?</hlm-accordion-trigger>
					<hlm-accordion-content>
						Yes. It's animated by default, but you can disable it if you prefer.
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
					<hlm-accordion-trigger>Enter your name</hlm-accordion-trigger>
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

export const TestAriaValidWithIcon: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<hlm-accordion-trigger>Button text with icon inside</hlm-accordion-trigger>
					<hlm-accordion-content>
						This is the correct way - icon is inside the button, not a sibling
					</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Correct structure - icon is inside the button element',
			},
		},
	},
};

// Button State Sync
export const ButtonStateSync: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [ButtonStateSyncStory],
		},
		template: `<accordion-button-state-sync/>`,
	}),
};
@Component({
	selector: 'accordion-button-state-sync',
	imports: [HlmButtonImports, HlmAccordionImports],
	host: {
		class: 'max-w-lg h-[320px] flex flex-col justify-between',
	},
	template: `
		<hlm-accordion type="multiple" class="pb-4">
			<hlm-accordion-item [isOpened]="true">
				<hlm-accordion-trigger>Is it accessible?</hlm-accordion-trigger>
				<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
			</hlm-accordion-item>

			<hlm-accordion-item>
				<hlm-accordion-trigger>Is it styled?</hlm-accordion-trigger>
				<hlm-accordion-content>
					Yes. It comes with default styles that match the other components' aesthetics.
				</hlm-accordion-content>
			</hlm-accordion-item>

			<hlm-accordion-item (openedChange)="_thirdOpened.set($event)" [isOpened]="_thirdOpened()">
				<hlm-accordion-trigger>Is it animated?</hlm-accordion-trigger>
				<hlm-accordion-content>
					Yes. It's animated by default, but you can disable it if you prefer.
				</hlm-accordion-content>
			</hlm-accordion-item>
		</hlm-accordion>
		<button hlmBtn class="w-fit" (click)="toggleThird()">Toggle Third Item</button>
	`,
})
export class ButtonStateSyncStory {
	protected readonly _thirdOpened = signal(false);
	toggleThird() {
		this._thirdOpened.set(!this._thirdOpened());
	}
}
