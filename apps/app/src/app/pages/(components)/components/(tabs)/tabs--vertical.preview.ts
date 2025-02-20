import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import {
	HlmTabsComponent,
	HlmTabsContentDirective,
	HlmTabsListComponent,
	HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';

@Component({
	selector: 'spartan-tabs-vertical',
	imports: [
		HlmTabsComponent,
		HlmTabsListComponent,
		HlmTabsTriggerDirective,
		HlmTabsContentDirective,
		HlmCardContentDirective,
		HlmCardDescriptionDirective,
		HlmCardDirective,
		HlmCardFooterDirective,
		HlmCardHeaderDirective,
		HlmCardTitleDirective,
		HlmLabelDirective,
		HlmInputDirective,
		HlmButtonDirective,
		HlmBadgeDirective,
	],
	host: {
		class: 'block w-full max-w-lg min-h-[400px]',
	},
	template: `
		<hlm-tabs tab="account" class="mx-auto flex max-w-3xl flex-row space-x-2" orientation="vertical">
			<hlm-tabs-list orientation="vertical" aria-label="tabs example">
				<button class="w-full" hlmTabsTrigger="account">Account</button>
				<button class="w-full" hlmTabsTrigger="password">Password</button>
				<button class="w-full" hlmTabsTrigger="danger">Danger Zone</button>
			</hlm-tabs-list>
			<div hlmTabsContent="account">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Account</h3>
						<p hlmCardDescription>Make changes to your account here. Click save when you're done.</p>
					</div>
					<p hlmCardContent>
						<label class="my-4 block" hlmLabel>
							Name
							<input class="mt-1.5 w-full" value="Pedro Duarte" hlmInput />
						</label>
						<label class="my-4 block" hlmLabel>
							Username
							<input class="mt-1.5 w-full" placeholder="@peduarte" hlmInput />
						</label>
					</p>
					<div hlmCardFooter>
						<button hlmBtn>Save Changes</button>
					</div>
				</section>
			</div>
			<div hlmTabsContent="password">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Password</h3>
						<p hlmCardDescription>Change your password here. After saving, you'll be logged out.</p>
					</div>
					<p hlmCardContent>
						<label class="my-4 block" hlmLabel>
							Old Password
							<input class="mt-1.5 w-full" type="password" hlmInput />
						</label>
						<label class="my-4 block" hlmLabel>
							New Password
							<input class="mt-1.5 w-full" type="password" hlmInput />
						</label>
					</p>
					<div hlmCardFooter>
						<button hlmBtn>Save Password</button>
					</div>
				</section>
			</div>
			<div hlmTabsContent="danger">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Delete Account</h3>
						<p hlmCardDescription>Are you sure you want to delete your account? You cannot undo this action.</p>
					</div>
					<div hlmCardFooter>
						<button variant="destructive" hlmBtn>Delete Account</button>
					</div>
				</section>
			</div>
		</hlm-tabs>
	`,
})
export class TabsVerticalPreviewComponent {}

export const verticalCode = `import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import {
	HlmTabsComponent,
	HlmTabsContentDirective,
	HlmTabsListComponent,
	HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';

@Component({
	selector: 'spartan-tabs-vertical',
	standalone: true,
	imports: [
		HlmTabsComponent,
		HlmTabsListComponent,
		HlmTabsTriggerDirective,
		HlmTabsContentDirective,

		HlmCardContentDirective,
		HlmCardDescriptionDirective,
		HlmCardDirective,
		HlmCardFooterDirective,
		HlmCardHeaderDirective,
		HlmCardTitleDirective,

		HlmLabelDirective,
		HlmInputDirective,
		HlmButtonDirective,
		HlmBadgeDirective,
	],
	host: {
		class: 'block w-full max-w-lg min-h-[400px]',
	},
	template: \`
		<hlm-tabs tab="account" class="flex flex-row max-w-3xl mx-auto space-x-2" orientation="vertical">
			<hlm-tabs-list orientation="vertical" aria-label="tabs example">
				<button class="w-full" hlmTabsTrigger="account">Account</button>
				<button class="w-full" hlmTabsTrigger="password">Password</button>
				<button class="w-full" hlmTabsTrigger="danger">Danger Zone</button>
			</hlm-tabs-list>
			<div hlmTabsContent="account">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Account</h3>
						<p hlmCardDescription>Make changes to your account here. Click save when you're done.</p>
					</div>
					<p hlmCardContent>
						<label class="block my-4" hlmLabel>
							Name
							<input class="mt-1.5 w-full" value="Pedro Duarte" hlmInput />
						</label>
						<label class="block my-4" hlmLabel>
							Username
							<input class="mt-1.5 w-full" placeholder="@peduarte" hlmInput />
						</label>
					</p>
					<div hlmCardFooter>
						<button hlmBtn>Save Changes</button>
					</div>
				</section>
			</div>
			<div hlmTabsContent="password">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Password</h3>
						<p hlmCardDescription>Change your password here. After saving, you'll be logged out.</p>
					</div>
					<p hlmCardContent>
						<label class="block my-4" hlmLabel>
							Old Password
							<input class="mt-1.5 w-full" type="password" hlmInput />
						</label>
						<label class="block my-4" hlmLabel>
							New Password
							<input class="mt-1.5 w-full" type="password" hlmInput />
						</label>
					</p>
					<div hlmCardFooter>
						<button hlmBtn>Save Password</button>
					</div>
				</section>
			</div>
			<div hlmTabsContent="danger">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Delete Account</h3>
						<p hlmCardDescription>Are you sure you want to delete your account? You cannot undo this action.</p>
					</div>
					<div hlmCardFooter>
						<button variant="destructive" hlmBtn>Delete Account</button>
					</div>
				</section>
			</div>
		</hlm-tabs>
	\`,
})
export class TabsVerticalPreviewComponent {}
`;
