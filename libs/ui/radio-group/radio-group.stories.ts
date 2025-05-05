import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnRadioGroupDirective } from '@spartan-ng/brain/radio-group';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmLabelDirective } from '../label/helm/src';
import { HlmCodeDirective, HlmSmallDirective } from '../typography/helm/src';
import { HlmRadioGroupImports } from './helm/src';

@Component({
	selector: 'radio-group-example',
	standalone: true,
	imports: [
		HlmRadioGroupImports,
		FormsModule,
		HlmButtonDirective,
		HlmCodeDirective,
		HlmSmallDirective,
		HlmLabelDirective,
	],
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
			<label class="flex items-center" hlmLabel>
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
