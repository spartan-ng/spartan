import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmToaster } from '@spartan-ng/helm/sonner';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { toast } from 'ngx-sonner';

const meta: Meta<HlmToaster> = {
	title: 'Sonner',
	component: HlmToaster,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmToaster, HlmButton],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmToaster>;

@Component({
	selector: 'sonner-story',
	imports: [HlmToaster, HlmButton],
	template: `
		<hlm-toaster />
		<button hlmBtn (click)="showToast()">Show Toast</button>
	`,
})
export class SonnerStory {
	showToast() {
		toast('Event has been created', {
			description: 'Sunday, December 03, 2023 at 9:00 AM',
			action: {
				label: 'Undo',
				onClick: () => console.log('Undo'),
			},
		});
	}
}

export const Default: Story = {
	render: () => ({
		template: '<sonner-story />',
	}),
};
