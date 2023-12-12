import { Component } from '@angular/core';
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
import { BrnTabsDirective } from '@spartan-ng/ui-tabs-brain';
import { HlmTabsContentDirective, HlmTabsListDirective, HlmTabsTriggerDirective } from '@spartan-ng/ui-tabs-helm';

@Component({
	selector: 'spartan-tabs-preview',
	standalone: true,
	imports: [
		BrnTabsDirective,

		HlmTabsListDirective,
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
	],
	host: {
		class: 'block w-full max-w-lg',
	},
	template: `
		<div brnTabs="account" class="w-full">
			<div hlmTabsList class="grid w-full grid-cols-2" aria-label="tabs example">
				<button hlmTabsTrigger="account">Account</button>
				<button hlmTabsTrigger="password">Password</button>
			</div>
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
		</div>
	`,
})
export class TabsPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
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
	BrnTabsDirective,
	BrnTabsContentDirective,
	BrnTabsListDirective,
	BrnTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-brain';
import { HlmTabsContentDirective, HlmTabsListDirective, HlmTabsTriggerDirective } from '@spartan-ng/ui-tabs-helm';

@Component({
	selector: 'spartan-tabs-preview',
	standalone: true,
	imports: [
		BrnTabsDirective,

		HlmTabsListDirective,
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
	],
	host: {
		class: 'block w-full max-w-lg',
	},
	template: \`
		<div brnTabs="account" class="w-full">
			<div hlmTabsList class="grid w-full grid-cols-2" aria-label="tabs example">
				<button hlmTabsTrigger="account">Account</button>
				<button hlmTabsTrigger="password">Password</button>
			</div>
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
		</div>
	\`,
})
export class TabsPreviewComponent {}

`;

export const defaultImports = `
import {
	BrnTabsDirective,
	BrnTabsContentDirective,
	BrnTabsListDirective,
	BrnTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-brain';
import { HlmTabsContentDirective, HlmTabsListDirective, HlmTabsTriggerDirective } from '@spartan-ng/ui-tabs-helm';
`;
export const defaultSkeleton = `
<div brnTabs='account' class='block max-w-3xl mx-auto'>
  <div hlmTabsList class='grid w-full grid-cols-2' aria-label='tabs example'>
    <button hlmTabsTrigger='account'>Account</button>
    <button hlmTabsTrigger='password'>Password</button>
  </div>
  <div hlmTabsContent='account'>
    Make your account here
  </div>
  <div hlmTabsContent='password'>
    Change your password here
  </div>
</div>
`;
