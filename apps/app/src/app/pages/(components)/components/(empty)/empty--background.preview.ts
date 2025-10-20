import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideRefreshCcw } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

@Component({
	selector: 'spartan-empty-background',
	imports: [NgIcon, HlmButton, HlmEmptyImports],
	providers: [provideIcons({ lucideBell, lucideRefreshCcw })],
	template: `
		<div hlmEmpty class="from-muted/50 to-background h-full w-full bg-gradient-to-b from-30%">
			<div hlmEmptyHeader>
				<div hlmEmptyMedia variant="icon">
					<ng-icon name="lucideBell" />
				</div>
				<div hlmEmptyTitle>No notifications</div>
				<div hlmEmptyDescription>You're all caught up. New notifications will appear here.</div>
			</div>
			<div hlmEmptyContent>
				<button hlmBtn variant="outline">
					<ng-icon hlm name="lucideRefreshCcw" />
					Refresh
				</button>
			</div>
		</div>
	`,
})
export class EmptyBackground {}
