import { Component } from '@angular/core';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<{}> = {
	title: 'Combobox',
	decorators: [
		moduleMetadata({
			imports: [HlmComboboxImports],
		}),
	],
};

export default meta;
type Story = StoryObj<{}>;
type Framework = { label: string; value: string };

@Component({
	selector: 'combobox-component',
	imports: [HlmComboboxImports],
	template: `
		<hlm-combobox>
			<hlm-combobox-input placeholder="Select framework..." />
			<hlm-combobox-content *hlmComboboxPortal>
				<hlm-combobox-empty>No items found.</hlm-combobox-empty>
				<div hlmComboboxList>
					@for (framework of frameworks; track $index) {
						<hlm-combobox-item [value]="framework">{{ framework.label }}</hlm-combobox-item>
					}
				</div>
			</hlm-combobox-content>
		</hlm-combobox>
	`,
})
export class Combobox {
	public frameworks: Framework[] = [
		{
			label: 'AnalogJs',
			value: 'analogjs',
		},
		{
			label: 'Angular',
			value: 'angular',
		},
		{
			label: 'Vue',
			value: 'vue',
		},
		{
			label: 'Nuxt',
			value: 'nuxt',
		},
		{
			label: 'React',
			value: 'react',
		},
		{
			label: 'NextJs',
			value: 'nextjs',
		},
		{
			label: 'Svelte',
			value: 'svelte',
		},
		{
			label: 'Astro',
			value: 'astro',
		},
		{
			label: 'Ember',
			value: 'ember',
		},
		{
			label: 'Backbone',
			value: 'backbone',
		},
		{
			label: 'Lit',
			value: 'lit',
		},
		{
			label: 'Preact',
			value: 'preact',
		},
		{
			label: 'SolidJS',
			value: 'solidjs',
		},
		{
			label: 'Remix',
			value: 'remix',
		},
		{
			label: 'Gatsby',
			value: 'gatsby',
		},
		{
			label: 'Qwik',
			value: 'qwik',
		},
		{
			label: 'Blazor',
			value: 'blazor',
		},
		{
			label: 'Flutter Web',
			value: 'flutter-web',
		},
		{
			label: 'Ionic Angular',
			value: 'ionic-angular',
		},
	];
}

export const Default: Story = {
	decorators: [
		moduleMetadata({
			imports: [Combobox],
		}),
	],
	render: () => ({
		template: '<combobox-component/>',
	}),
};
