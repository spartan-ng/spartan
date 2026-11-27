import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmConfirmation, HlmConfirmationImports } from '@spartan-ng/helm/confirmation';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Confirmation',
	component: HlmConfirmation,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmConfirmationImports, HlmButtonImports],
		}),
	],
} as Meta<HlmConfirmation>;

type Story = StoryObj<HlmConfirmation>;

export const Default: Story = {
	render: () => ({
		template: `
			<div hlmConfirmation class="max-w-md w-full">
				<div>
					<h4 hlmConfirmationTitle>Delete 1,420 records?</h4>
					<p hlmConfirmationDescription>The agent wants to remove inactive users from the archive table.</p>
				</div>
				<div hlmConfirmationActions>
					<button hlmBtn hlmConfirmationReject variant="outline" size="sm">Reject</button>
					<button hlmBtn hlmConfirmationApprove size="sm">Approve</button>
				</div>
			</div>
		`,
	}),
};

export const Approved: Story = {
	render: () => ({
		template: `
			<div hlmConfirmation state="approved" class="max-w-md w-full">
				<h4 hlmConfirmationTitle>Delete 1,420 records?</h4>
				<p hlmConfirmationDescription>Approved by you.</p>
			</div>
		`,
	}),
};
