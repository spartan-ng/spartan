import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideTerminal } from '@ng-icons/lucide';
import { HlmTrace, HlmTraceImports } from '@spartan-ng/helm/trace';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Trace',
	component: HlmTrace,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmTraceImports, NgIcon],
			providers: [provideIcons({ lucideTerminal, lucideCircleAlert })],
		}),
	],
} as Meta<HlmTrace>;

type Story = StoryObj<HlmTrace>;

export const Default: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-trace class="max-w-sm">
				<hlm-trace-collapsible>
					<button hlmTraceCollapsibleTrigger>
						<hlm-trace-line>
							<hlm-trace-icon>
								<ng-icon name="lucideTerminal" />
							</hlm-trace-icon>
							<hlm-trace-title>Ran pnpm --version</hlm-trace-title>
						</hlm-trace-line>
					</button>
					<hlm-trace-collapsible-content>$ pnpm --version 10.33.4</hlm-trace-collapsible-content>
				</hlm-trace-collapsible>

				<hlm-trace-line status="error">
					<hlm-trace-icon>
						<ng-icon name="lucideCircleAlert" />
					</hlm-trace-icon>
					<hlm-trace-title>Failed to run pnpm install --frozen-lockfile</hlm-trace-title>
				</hlm-trace-line>
			</hlm-trace>
		`,
	}),
};
