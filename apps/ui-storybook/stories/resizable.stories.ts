import { Component, signal } from '@angular/core';
import { HlmResizableImports } from '@spartan-ng/helm/resizable';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

@Component({
	selector: 'resizable-example',
	imports: [HlmResizableImports],
	template: `
		<hlm-resizable-group class="h-[200px] w-[500px] max-w-md rounded-lg border">
			<hlm-resizable-panel>
				<div class="flex h-full items-center justify-center p-6">One</div>
			</hlm-resizable-panel>
			<hlm-resizable-handle />
			<hlm-resizable-panel>
				<hlm-resizable-group direction="vertical">
					<hlm-resizable-panel>
						<div class="flex h-full items-center justify-center p-6">
							<span class="font-semibold">Two</span>
						</div>
					</hlm-resizable-panel>
					<hlm-resizable-handle />
					<hlm-resizable-panel>
						<div class="flex h-full items-center justify-center p-6">
							<span class="font-semibold">Three</span>
						</div>
					</hlm-resizable-panel>
				</hlm-resizable-group>
			</hlm-resizable-panel>
		</hlm-resizable-group>
	`,
})
class ResizableExample {}

@Component({
	selector: 'resizable-dynamic-panels-example',
	imports: [HlmResizableImports],
	template: `
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4">
				<button
					type="button"
					class="rounded-md border px-3 py-2 text-sm font-medium"
					(click)="showExtra.update((value) => !value)"
				>
					{{ showExtra() ? 'Remove' : 'Add' }} extra panel
				</button>
				<span class="text-muted-foreground text-sm">Layout: {{ layout().join(', ') }}</span>
			</div>

			<hlm-resizable-group
				direction="vertical"
				class="h-[360px] w-[500px] max-w-md rounded-lg border"
				[(layout)]="layout"
			>
				<hlm-resizable-panel [defaultSize]="25">
					<div class="flex h-full items-center justify-center p-6 font-semibold">Header</div>
				</hlm-resizable-panel>
				<hlm-resizable-handle withHandle />
				<hlm-resizable-panel [defaultSize]="75">
					<div class="flex h-full items-center justify-center p-6 font-semibold">Content</div>
				</hlm-resizable-panel>
				@if (showExtra()) {
					<hlm-resizable-handle withHandle />
					<hlm-resizable-panel [defaultSize]="25">
						<div class="flex h-full items-center justify-center p-6 font-semibold">Extra Dynamic Panel</div>
					</hlm-resizable-panel>
				}
			</hlm-resizable-group>
		</div>
	`,
})
class ResizableDynamicPanelsExample {
	protected readonly showExtra = signal(false);
	protected readonly layout = signal<number[]>([]);
}

export default {
	title: 'Resizable',
	component: ResizableExample,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmResizableImports, ResizableDynamicPanelsExample],
		}),
	],
} as Meta<ResizableExample>;

type Story = StoryObj<ResizableExample>;

export const Default: Story = {
	render: () => ({
		template: `
<resizable-example></resizable-example>
		`,
	}),
};

export const DynamicPanels: Story = {
	render: () => ({
		template: `
<resizable-dynamic-panels-example></resizable-dynamic-panels-example>
		`,
	}),
};
