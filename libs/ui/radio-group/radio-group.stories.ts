import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { BrnRadioGroupDirective } from '@spartan-ng/brain/radio-group';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmIconDirective } from '../icon/helm/src';
import { HlmCodeDirective, HlmSmallDirective } from '../typography/helm/src';
import { HlmRadioGroupImports } from './helm/src';

@Component({
	selector: 'radio-group-example',
	standalone: true,
	imports: [
		HlmRadioGroupImports,
		FormsModule,
		NgIcon,
		HlmIconDirective,
		HlmButtonDirective,
		HlmCodeDirective,
		HlmSmallDirective,
	],
	template: `
		<small hlmSmall class="font-semibold">Choose a version</small>
		<hlm-radio-group class="font-mono text-sm font-medium" [(ngModel)]="version">
			<hlm-radio value="16.1.4">
				<hlm-radio-indicator indicator />
				v16.1.4
			</hlm-radio>
			<hlm-radio value="16.0.0">
				<hlm-radio-indicator indicator />
				v16.0.0
			</hlm-radio>
			<hlm-radio value="15.8.0">
				<hlm-radio-indicator indicator />
				v15.8.0
			</hlm-radio>
			<hlm-radio disabled value="15.2.0">
				<hlm-radio-indicator indicator />
				v15.2.0
			</hlm-radio>
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
class RadioGroupExampleComponent {
	version: string | null = '16.1.4';
}

const meta: Meta<BrnRadioGroupDirective> = {
	title: 'Radio Group',
	component: BrnRadioGroupDirective,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [RadioGroupExampleComponent],
			providers: [],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnRadioGroupDirective>;

export const Default: Story = {
	render: () => ({
		template: '<radio-group-example/>',
	}),
};
