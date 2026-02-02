import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

const meta: Meta<HlmTooltip> = {
	title: 'Tooltip',
	component: HlmTooltip,
	tags: ['autodocs'],
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [HlmButton, HlmTooltip, NgIcon, HlmIcon],
			providers: [provideIcons({ lucidePlus })],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmTooltip>;
export const Default: Story = {
	argTypes: {
		position: {
			control: { type: 'radio' },
			options: ['top', 'left', 'right', 'bottom'],
			defaultValue: 'top',
		},
	},
	render: ({ ...args }) => ({
		props: args,
		template: `
<div class='p-40'>
  <hlm-tooltip>
    <button [hlmTooltip]="tooltip" ${argsToTemplate(args)}  hlmBtn variant='outline'>Test</button>
    <ng-template #tooltip>

    <span class='flex items-center'>
      Add to library <ng-icon hlm class='ml-2' size='sm' name='lucidePlus'/>
     </span>
</ng-template>
  </hlm-tooltip>
</div>
`,
	}),
};

@Component({
	selector: 'simple-tooltip-story',
	imports: [HlmButton, HlmTooltip, NgIcon, HlmIcon],
	providers: [provideIcons({ lucidePlus })],
	template: `
		<div class="p-40">
			<button
				(click)="_disabled.set(!_disabled())"
				[hlmTooltip]="'Add to library'"
				[tooltipDisabled]="_disabled()"
				hlmBtn
				size="icon"
			>
				<ng-icon hlm name="lucidePlus" size="sm" />
			</button>
		</div>
	`,
})
class SimpleTooltip {
	protected readonly _disabled = signal(false);
}

export const Simple: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [SimpleTooltip],
		},
		template: '<simple-tooltip-story/>',
	}),
};

@Component({
	selector: 'disabled-tooltip-story',
	imports: [HlmButton, HlmTooltip, NgIcon, HlmIcon],
	providers: [provideIcons({ lucidePlus })],
	template: `
		<div class="p-40">
			<button
				(click)="_disabled.set(!_disabled())"
				[hlmTooltip]="tooltip"
				[tooltipDisabled]="_disabled()"
				hlmBtn
				variant="outline"
			>
				Test
			</button>
			<ng-template #tooltip>
				<span class="flex items-center">
					Add to library
					<ng-icon hlm class="ml-2" size="sm" name="lucidePlus" />
				</span>
			</ng-template>

			<p>{{ _disabled() ? 'disabled' : 'enabled' }}</p>
		</div>
	`,
})
class DisabledTooltip {
	protected readonly _disabled = signal(false);
}

export const Disabled: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [DisabledTooltip],
		},
		template: '<disabled-tooltip-story/>',
	}),
};
