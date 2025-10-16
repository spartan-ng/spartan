import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnRadioGroup } from '@spartan-ng/brain/radio-group';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmCode, HlmSmall } from '@spartan-ng/helm/typography';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

@Component({
	selector: 'radio-group-example',
	imports: [HlmRadioGroupImports, FormsModule, HlmButton, HlmCode, HlmSmall, HlmLabel],
	template: `
		<small hlmSmall class="font-semibold">Choose a version</small>
		<hlm-radio-group class="font-mono text-sm font-medium" [(ngModel)]="version">
			<label class="flex items-center" hlmLabel>
				<hlm-radio value="16.1.4">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v16.1.4
			</label>
			<label class="flex items-center" hlmLabel>
				<hlm-radio value="16.0.0">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v16.0.0
			</label>
			<label class="flex items-center" hlmLabel>
				<hlm-radio value="15.8.0">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v15.8.0
			</label>
			<label class="flex items-center" hlmLabel data-testid="disabledLabel">
				<hlm-radio disabled value="15.2.0">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v15.2.0
			</label>
		</hlm-radio-group>
		<div class="my-2 flex space-x-2">
			<button size="sm" hlmBtn variant="outline" (click)="version = '16.0.0'">Set to v16.0.0</button>
			<button size="sm" hlmBtn variant="outline" (click)="version = null">Reset</button>
		</div>
		<small hlmSmall class="mt-6 block font-semibold">
			Current Version:
			<code data-testid="currentVersion" hlmCode class="text-xs">{{ version ?? 'none' }}</code>
		</small>
	`,
})
class RadioGroupExample {
	version: string | null = '16.1.4';
}

const meta: Meta<BrnRadioGroup> = {
	title: 'Radio Group',
	component: BrnRadioGroup,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [RadioGroupExample, HlmRadioGroupImports, FormsModule, HlmButton, HlmCode, HlmSmall, HlmLabel],
			providers: [],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnRadioGroup>;

export const Default: Story = {
	render: () => ({
		template: '<radio-group-example/>',
	}),
};

export const LabelFor: Story = {
	render: () => ({
		template: `
		<hlm-radio-group class="text-sm font-medium" >
			<div class="flex items-center gap-3">
				<hlm-radio value="default" id="default">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="default" >
					Default
				</label>
			</div>
			<div class="flex items-center gap-3">
				<hlm-radio value="comfortable" id="comfortable">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="comfortable" >
					Comfortable
				</label>
			</div>
			<div class="flex items-center gap-3">
				<hlm-radio value="compact" id="compact">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="compact" >
					Compact
				</label>
			</div>
			<div class="flex items-center gap-3">
				<hlm-radio class="peer group" disabled=true value="disabled" id="disabled">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="disabled" >
					Disabled
				</label>
			</div>
		</hlm-radio-group>
`,
	}),
};
