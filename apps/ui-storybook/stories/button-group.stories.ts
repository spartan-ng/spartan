import { RouterTestingModule } from '@angular/router/testing';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSlash } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroup, HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIcon } from '@spartan-ng/helm/icon';
import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmButtonGroup> = {
	title: 'Button Group',
	component: HlmButtonGroup,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmButtonGroupImports, HlmButton, NgIcon, HlmIcon, RouterTestingModule],
			providers: [provideIcons({ lucideSlash })],
		}),
	],
};

export default meta;
type Story = Meta<HlmButtonGroup>;

export const Default: Story = {
	render: () => ({
		template: /* HTML */ `
			<div hlmButtonGroup>
				<button hlmBtn variant="outline">Button 1</button>
				<button hlmBtn variant="outline">Button 2</button>
			</div>
		`,
	}),
};

export const Split: Story = {
	render: () => ({
		template: /* HTML */ `
			<div hlmButtonGroup>
				<button hlmBtn variant="secondary">Button 1</button>
				<hlm-button-group-separator />
				<button hlmBtn variant="secondary">Button 2</button>
			</div>
		`,
	}),
};

export const Nested: Story = {
	render: () => ({
		template: /* HTML */ `
			<div hlmButtonGroup>
				<div hlmButtonGroup>
					<button hlmBtn variant="outline">Button 1</button>
					<button hlmBtn variant="outline">Button 2</button>
				</div>
				<div hlmButtonGroup>
					<button hlmBtn variant="outline">Button 3</button>
					<button hlmBtn variant="outline">Button 4</button>
				</div>
			</div>
		`,
	}),
};

export const WithText: Story = {
	render: () => ({
		template: /* HTML */ `
			<div hlmButtonGroup>
				<div hlmButtonGroup>
					<button hlmBtn variant="outline">Button 1</button>
					<button hlmBtn variant="outline">Button 2</button>
				</div>
				<hlm-button-group-separator />
				<div hlmButtonGroup>
					<span hlmButtonGroupText>Text</span>
				</div>
			</div>
		`,
	}),
};
