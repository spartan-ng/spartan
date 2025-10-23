import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnAccordion, BrnAccordionImports } from '@spartan-ng/brain/accordion';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon, HlmIconImports } from '@spartan-ng/helm/icon';
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

				<hlm-accordion-item>
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
		`,
	}),
};

export const Multiple: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion type="multiple">
				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Can multiple panels be open?
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
					<hlm-accordion-content>Yes. Set type="multiple" to allow multiple panels open.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Does it maintain state?
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
					<hlm-accordion-content>
						Yes. Each panel maintains its own open/closed state independently.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Is it keyboard navigable?
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
					<hlm-accordion-content>
						Yes. Full keyboard support with arrow keys, Home, End, Space, and Enter.
					</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
};

export const Horizontal: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion orientation="horizontal">
				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Horizontal navigation?
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
					<hlm-accordion-content>Use Left/Right arrow keys for horizontal orientation.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Different from vertical?
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
					<hlm-accordion-content>Arrow key navigation changes from Up/Down to Left/Right.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Still accessible?
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>

					<hlm-accordion-content>Yes. Full ARIA support with proper orientation attributes.</hlm-accordion-content>
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
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Form Controls Test
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
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
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Additional Panel
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
					<hlm-accordion-content>This panel helps test navigation between triggers.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Third Panel
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
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
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Is the button tapable when closed?
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>

					<hlm-accordion-content>
						<button data-testid="not-tapable-when-closed" class="rounded bg-blue-500 px-4 py-2 text-white">
							This button should not be focusable when panel is closed
						</button>
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Is the button tapable when open?
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
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
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Is it an accessible accordion
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
					<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Is it a styled accordion?
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
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

			<hlm-accordion>
				<hlm-accordion-item>
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

				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Is it nicely styled?
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
					<hlm-accordion-content>
						Yes. It comes with default styles that match the other components' aesthetics.
					</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Is it very nicely styled?
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
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

				<hlm-accordion-item isOpened>
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
		`,
	}),
};

export const AccordionWithInput: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<h3 class="contents">
						<button hlmAccordionTrigger>
							Enter your name
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
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

// Valid ARIA structures
export const TestAriaValidNativeHeading: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<h3>
						<button hlmAccordionTrigger>Properly structured with h3</button>
					</h3>
					<hlm-accordion-content>Content here</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
};

export const TestAriaValidRoleHeading: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<div role="heading" aria-level="3">
						<button hlmAccordionTrigger>With role="heading" and aria-level</button>
					</div>
					<hlm-accordion-content>Content here</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
};

export const TestAriaValidAllHeadings: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<h1><button hlmAccordionTrigger>H1 Heading</button></h1>
					<hlm-accordion-content>Content 1</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h2><button hlmAccordionTrigger>H2 Heading</button></h2>
					<hlm-accordion-content>Content 2</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h3><button hlmAccordionTrigger>H3 Heading</button></h3>
					<hlm-accordion-content>Content 3</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h4><button hlmAccordionTrigger>H4 Heading</button></h4>
					<hlm-accordion-content>Content 4</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h5><button hlmAccordionTrigger>H5 Heading</button></h5>
					<hlm-accordion-content>Content 5</hlm-accordion-content>
				</hlm-accordion-item>

				<hlm-accordion-item>
					<h6><button hlmAccordionTrigger>H6 Heading</button></h6>
					<hlm-accordion-content>Content 6</hlm-accordion-content>
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
					<h3>
						<button hlmAccordionTrigger>
							Button text with icon inside
							<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
						</button>
					</h3>
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

// Invalid ARIA structures - these will throw errors
export const TestAriaInvalidNotButton: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<h3>
						<div hlmAccordionTrigger>Not a button element</div>
					</h3>
					<hlm-accordion-content>Content here</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'This will throw an error - trigger must be a button',
			},
		},
	},
};

export const TestAriaInvalidNoHeading: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<div>
						<button hlmAccordionTrigger>Not wrapped in heading</button>
					</div>
					<hlm-accordion-content>Content here</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'This will throw an error - button must be wrapped in heading',
			},
		},
	},
};

export const TestAriaInvalidNoAriaLevel: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<div role="heading">
						<button hlmAccordionTrigger>Missing aria-level</button>
					</div>
					<hlm-accordion-content>Content here</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'This will throw an error - role="heading" requires aria-level',
			},
		},
	},
};

export const TestAriaInvalidAriaLevelValue: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-accordion>
				<hlm-accordion-item>
					<div role="heading" aria-level="10">
						<button hlmAccordionTrigger>Invalid aria-level value</button>
					</div>
					<hlm-accordion-content>Content here</hlm-accordion-content>
				</hlm-accordion-item>
			</hlm-accordion>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'This will throw an error - aria-level must be 1-6',
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
export class ButtonStateSyncStory {
	protected readonly _thirdOpened = signal(false);
	toggleThird() {
		this._thirdOpened.set(!this._thirdOpened());
	}
}
