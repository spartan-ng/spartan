import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileText } from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

const meta: Meta = {
	title: 'Attachment',
	tags: ['autodocs'],
	decorators: [
		applicationConfig({
			providers: [provideIcons({ lucideFileText, lucideDownload })],
		}),
		moduleMetadata({
			imports: [HlmAttachmentImports, HlmSpinner, NgIcon],
		}),
	],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		template: `
			<div class="flex flex-col gap-3 p-4">
				<div hlmAttachment>
					<div hlmAttachmentMedia>
						<ng-icon name="lucideFileText" />
					</div>
					<div hlmAttachmentContent>
						<span hlmAttachmentTitle>sales-dashboard.pdf</span>
						<span hlmAttachmentDescription>PDF · 2.4 MB</span>
					</div>
					<div hlmAttachmentActions>
						<button hlmAttachmentAction aria-label="Download">
							<ng-icon name="lucideDownload" />
						</button>
					</div>
				</div>
				<div hlmAttachment state="uploading">
					<div hlmAttachmentMedia>
						<hlm-spinner />
					</div>
					<div hlmAttachmentContent>
						<span hlmAttachmentTitle>uploading.pdf</span>
						<span hlmAttachmentDescription>Uploading...</span>
					</div>
				</div>
			</div>
		`,
	}),
};
