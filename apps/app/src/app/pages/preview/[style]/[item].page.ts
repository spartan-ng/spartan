import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideChevronRight, lucideCreditCard, lucideImage, lucideMail, lucideMenu, lucidePlus, lucideSearch, lucideSettings, lucideUser } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
	selector: 'spartan-preview-page',
	imports: [HlmButton, HlmBadge, HlmCardImports, NgIcon],
	providers: [provideIcons({ lucideBell, lucideChevronRight, lucideCreditCard, lucideImage, lucideMail, lucideMenu, lucidePlus, lucideSearch, lucideSettings, lucideUser })],
	host: {
		class: 'block min-h-screen p-4',
	},
	template: `
		<div class="mx-auto max-w-4xl space-y-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-foreground text-2xl font-bold">Dashboard</h1>
					<p class="text-muted-foreground text-sm">{{ _item() === 'preview-01' ? 'Welcome back, user' : 'Manage your account settings' }}</p>
				</div>
				<div class="flex items-center gap-2">
					<button hlmBtn size="icon" variant="outline">
						<ng-icon name="lucideBell" size="16" />
					</button>
					<button hlmBtn size="icon" variant="outline">
						<ng-icon name="lucideSettings" size="16" />
					</button>
					<button hlmBtn size="icon" variant="outline">
						<ng-icon name="lucideUser" size="16" />
					</button>
				</div>
			</div>

			@if (_item() === 'preview-01') {
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Revenue</h3>
							<p hlmCardDescription>Monthly revenue overview</p>
						</div>
						<div hlmCardContent>
							<p class="text-3xl font-bold">$45,231</p>
							<p class="text-muted-foreground text-xs">+20.1% from last month</p>
						</div>
					</div>
					<div hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Subscriptions</h3>
							<p hlmCardDescription>Active subscribers</p>
						</div>
						<div hlmCardContent>
							<p class="text-3xl font-bold">+2,350</p>
							<p class="text-muted-foreground text-xs">+180.1% from last month</p>
						</div>
					</div>
					<div hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Sales</h3>
							<p hlmCardDescription>Total sales this quarter</p>
						</div>
						<div hlmCardContent>
							<p class="text-3xl font-bold">+12,234</p>
							<p class="text-muted-foreground text-xs">+19% from last month</p>
						</div>
					</div>
				</div>

				<div hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Recent Activity</h3>
						<p hlmCardDescription>Your latest actions and updates</p>
					</div>
					<div hlmCardContent class="space-y-3">
						@for (activity of _activities; track activity.title) {
							<div class="flex items-center gap-3">
								<div class="bg-primary/10 flex size-8 items-center justify-center rounded-full">
									<ng-icon [name]="activity.icon" size="14" class="text-primary" />
								</div>
								<div class="flex-1">
									<p class="text-sm font-medium">{{ activity.title }}</p>
									<p class="text-muted-foreground text-xs">{{ activity.description }}</p>
								</div>
								<ng-icon name="lucideChevronRight" size="14" class="text-muted-foreground" />
							</div>
						}
					</div>
				</div>
			} @else {
				<div class="grid gap-6 lg:grid-cols-2">
					<div hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Profile</h3>
							<p hlmCardDescription>Update your personal information</p>
						</div>
						<div hlmCardContent class="space-y-4">
							<div class="flex items-center gap-4">
								<div class="bg-muted flex size-16 items-center justify-center rounded-full">
									<ng-icon name="lucideUser" size="24" />
								</div>
								<div class="space-y-1">
									<button hlmBtn variant="outline" size="sm">
										<ng-icon name="lucideImage" class="mr-2" size="14" />
										Upload Photo
									</button>
									<p class="text-muted-foreground text-xs">JPG, GIF or PNG. Max 2MB.</p>
								</div>
							</div>
							<div class="grid gap-3 sm:grid-cols-2">
								<div>
									<label class="text-foreground text-sm font-medium">Name</label>
									<div class="bg-muted mt-1 rounded-md px-3 py-2 text-sm">John Doe</div>
								</div>
								<div>
									<label class="text-foreground text-sm font-medium">Email</label>
									<div class="bg-muted mt-1 rounded-md px-3 py-2 text-sm">john@example.com</div>
								</div>
							</div>
						</div>
					</div>

					<div hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Notifications</h3>
							<p hlmCardDescription>Configure how you receive updates</p>
						</div>
						<div hlmCardContent class="space-y-4">
							@for (notif of _notifications; track notif.label) {
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<ng-icon [name]="notif.icon" size="16" class="text-muted-foreground" />
										<span class="text-sm">{{ notif.label }}</span>
									</div>
									<span hlmBadge variant="secondary">{{ notif.badge }}</span>
								</div>
							}
						</div>
					</div>
				</div>

				<div class="flex flex-wrap gap-3">
					<button hlmBtn>Primary</button>
					<button hlmBtn variant="secondary">Secondary</button>
					<button hlmBtn variant="outline">Outline</button>
					<button hlmBtn variant="ghost">Ghost</button>
					<button hlmBtn variant="destructive">Destructive</button>
					<button hlmBtn variant="link">Link</button>
				</div>

				<div class="flex flex-wrap gap-2">
					<span hlmBadge>Default</span>
					<span hlmBadge variant="secondary">Secondary</span>
					<span hlmBadge variant="destructive">Destructive</span>
					<span hlmBadge variant="outline">Outline</span>
				</div>
			}
		</div>
	`,
})
export default class StylePreviewPage {
	private readonly _route = inject(ActivatedRoute);

	protected readonly _item = signal('preview-01');

	protected readonly _activities = [
		{ title: 'New user registered', description: '5 minutes ago', icon: 'lucideUser' },
		{ title: 'Payment received', description: '1 hour ago', icon: 'lucideCreditCard' },
		{ title: 'New email from support', description: '3 hours ago', icon: 'lucideMail' },
	];

	protected readonly _notifications = [
		{ label: 'Weekly digest', icon: 'lucideMail', badge: 'New' },
		{ label: 'Account alerts', icon: 'lucideBell', badge: '3' },
		{ label: 'Product updates', icon: 'lucideSettings', badge: '2' },
		{ label: 'Security notices', icon: 'lucideCreditCard', badge: '1' },
	];

	constructor() {
		this._route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
			const item = params.get('item');
			if (item === 'preview-01' || item === 'preview-02') {
				this._item.set(item);
			}
		});

		this._route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
			const darkMode = params['darkMode'];
			if (darkMode === '1') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		});
	}
}
