import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch, lucideSearch } from '@ng-icons/lucide';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

const meta: Meta = {
	title: 'Marker',
	tags: ['autodocs'],
	decorators: [
		applicationConfig({
			providers: [provideIcons({ lucideGitBranch, lucideSearch })],
		}),
		moduleMetadata({
			imports: [HlmMarkerImports, HlmSpinner, NgIcon],
		}),
	],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		template: `
			<div class="flex w-full max-w-sm flex-col gap-8 p-4">
				<div hlmMarker>
					<span hlmMarkerIcon><ng-icon name="lucideGitBranch" /></span>
					<span hlmMarkerContent>Switched to a new branch</span>
				</div>
				<div hlmMarker role="status">
					<span hlmMarkerIcon><hlm-spinner /></span>
					<span hlmMarkerContent class="shimmer">Thinking...</span>
				</div>
				<div hlmMarker variant="separator">
					<span hlmMarkerContent>Conversation compacted</span>
				</div>
				<div hlmMarker>
					<span hlmMarkerIcon><ng-icon name="lucideSearch" /></span>
					<span hlmMarkerContent>Explored 4 files</span>
				</div>
			</div>
		`,
	}),
};
