import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-demo',
	imports: [HlmItemImports, HlmButton, NgIcon],
	providers: [
		provideIcons({
			lucideBadgeCheck,
			lucideChevronRight,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'flex w-full max-w-md flex-col gap-6' },
	template: `
		<div hlmItem variant="outline">
			<div hlmItemContent>
				<div hlmItemTitle>Two-factor authentication</div>
				<p hlmItemDescription>Verify via email or phone number.</p>
			</div>
			<div hlmItemActions>
				<button hlmBtn size="sm">Enable</button>
			</div>
		</div>
		<a hlmItem variant="outline" size="sm">
			<div hlmItemMedia size="icon">
				<ng-icon name="lucideBadgeCheck" />
			</div>
			<div hlmItemContent>
				<div hlmItemTitle>Your profile has been verified.</div>
			</div>
			<div hlmItemActions>
				<ng-icon name="lucideChevronRight" />
			</div>
		</a>
	`,
})
export class ItemDemo {}
