import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideCheck } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';

@Component({
	selector: 'spartan-card-notifications',
	imports: [
		HlmButtonDirective,
		HlmCardContentDirective,
		HlmCardDescriptionDirective,
		HlmCardDirective,
		HlmCardFooterDirective,
		HlmCardHeaderDirective,
		HlmCardTitleDirective,
		NgIcon,
		HlmIconDirective,
		HlmSwitchComponent,
	],
	providers: [provideIcons({ lucideCheck, lucideBell })],
	template: `
		<section hlmCard>
			<div hlmCardHeader>
				<h3 hlmCardTitle>Notifications</h3>
				<p hlmCardDescription>You have 3 unread notifications</p>
			</div>
			<div hlmCardContent class="grid gap-4">
				<div class="border-border flex items-center space-x-4 rounded-md border p-4">
					<ng-icon hlm size="lg" name="lucideBell" />
					<div class="flex-1 space-y-1">
						<p class="text-sm font-medium leading-none">Push Notifications</p>
						<p class="text-muted-foreground text-sm">Send notifications to device.</p>
					</div>
					<hlm-switch class="ml-4" aria-label="Enable notifications" />
				</div>
				<div>
					@for (notification of notifications; track notification.id) {
						<div class="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
							<span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
							<div class="space-y-1">
								<p class="text-sm font-medium leading-none">{{ notification.title }}</p>
								<p class="text-muted-foreground text-sm">{{ notification.description }}</p>
							</div>
						</div>
					}
				</div>
			</div>
			<div hlmCardFooter class="justify-between">
				<button class="w-full" hlmBtn>
					<ng-icon hlm size="sm" class="mr-2" name="lucideCheck" />
					Mark all as read
				</button>
			</div>
		</section>
	`,
})
export class CardNotificationsComponent {
	protected notifications = [
		{
			id: 1,
			title: 'Your call has been confirmed.',
			description: '1 hour ago',
		},
		{
			id: 2,
			title: 'You have a new message!',
			description: '1 hour ago',
		},
		{
			id: 3,
			title: 'Your subscription is expiring soon!',
			description: '2 hours ago',
		},
	];
}

export const cardNotificationsCode = `import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideBell, lucideCheck } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';

@Component({
	selector: 'spartan-card-notifications',
	standalone: true,
	imports: [
		HlmButtonDirective,
		HlmCardContentDirective,
		HlmCardDescriptionDirective,
		HlmCardDirective,
		HlmCardFooterDirective,
		HlmCardHeaderDirective,
		HlmCardTitleDirective,
		HlmIconDirective,
		HlmSwitchComponent,
	],
	providers: [provideIcons({ lucideCheck, lucideBell })],
	template: \`
		<section hlmCard>
			<div hlmCardHeader>
				<h3 hlmCardTitle>Notifications</h3>
				<p hlmCardDescription>You have 3 unread notifications</p>
			</div>
			<div hlmCardContent class="grid gap-4">
				<div class="flex items-center p-4 border border-border space-x-4 rounded-md">
					<ng-icon hlm size="lg" name="lucideBell" />
					<div class="flex-1 space-y-1">
						<p class="text-sm font-medium leading-none">Push Notifications</p>
						<p class="text-sm text-muted-foreground">Send notifications to device.</p>
					</div>
					<hlm-switch class="ml-4" aria-label="Enable notifications" />
				</div>
				<div>
					@for (notification of notifications; track notification.id) {
						<div class="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
							<span class="flex w-2 h-2 rounded-full translate-y-1 bg-sky-500"></span>
							<div class="space-y-1">
								<p class="text-sm font-medium leading-none">{{ notification.title }}</p>
								<p class="text-sm text-muted-foreground">{{ notification.description }}</p>
							</div>
						</div>
					}
				</div>
			</div>
			<div hlmCardFooter class="justify-between">
				<button class="w-full" hlmBtn>
					<ng-icon hlm size="sm" class="mr-2" name="lucideCheck" />
					Mark all as read
				</button>
			</div>
		</section>
	\`,
})
export class CardNotificationsComponent {
	protected notifications = [
		{
			id: 1,
			title: 'Your call has been confirmed.',
			description: '1 hour ago',
		},
		{
			id: 2,
			title: 'You have a new message!',
			description: '1 hour ago',
		},
		{
			id: 3,
			title: 'Your subscription is expiring soon!',
			description: '2 hours ago',
		},
	];
}
`;
