import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideDatabase, lucideShieldAlert, lucideX } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmToolCall, HlmToolCallImports } from '@spartan-ng/helm/tool-call';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Tool Call',
	component: HlmToolCall,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmToolCallImports, HlmButtonImports, HlmBadge, NgIcon],
			providers: [provideIcons({ lucideDatabase, lucideShieldAlert, lucideCheck, lucideX })],
		}),
	],
} as Meta<HlmToolCall>;

type Story = StoryObj<HlmToolCall>;

export const Default: Story = {
	render: () => ({
		template: `
			<div hlmToolCall name="fetch_user_profile" state="result" class="max-w-md w-full">
				<div hlmToolCallHeader>
					<div class="flex items-center gap-2">
						<ng-icon name="lucideDatabase" class="size-4 text-primary" />
						<span class="font-mono text-sm font-medium">fetch_user_profile</span>
						<span hlmBadge variant="default">result</span>
					</div>
					<button hlmToolCallTrigger>Details</button>
				</div>
				<div hlmToolCallArgs>
					<code>{{ "{" }} "userId": "usr_102" {{ "}" }}</code>
				</div>
				<div hlmToolCallResult>
					<code>{{ "{" }} "name": "Jane Doe", "status": "active" {{ "}" }}</code>
				</div>
			</div>
		`,
	}),
};

export const RequiresApproval: Story = {
	render: () => ({
		template: `
			<div hlmToolCall name="send_invoice" state="requires-approval" class="max-w-md w-full">
				<div hlmToolCallHeader>
					<div class="flex items-center gap-2">
						<ng-icon name="lucideShieldAlert" class="size-4 text-amber-500" />
						<span class="font-mono text-sm font-medium">send_invoice</span>
						<span hlmBadge variant="destructive">requires-approval</span>
					</div>
				</div>
				<div class="p-3 text-sm text-muted-foreground border-t border-border/50">
					Send an invoice of $1,500.00 to client Acme Corp?
				</div>
				<div hlmToolCallActions>
					<button hlmBtn hlmToolCallReject variant="outline" size="sm">
						<ng-icon name="lucideX" class="size-3.5 mr-1" />
						Reject
					</button>
					<button hlmBtn hlmToolCallApprove variant="default" size="sm">
						<ng-icon name="lucideCheck" class="size-3.5 mr-1" />
						Approve
					</button>
				</div>
			</div>
		`,
	}),
};
