import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import {
	HlmCard,
	HlmCardContent,
	HlmCardDescription,
	HlmCardFooter,
	HlmCardHeader,
	HlmCardTitle,
} from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmTabs, HlmTabsContent, HlmTabsList, HlmTabsTrigger } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'spartan-tabs-preview',
	imports: [
		HlmTabs,
		HlmTabsList,
		HlmTabsTrigger,
		HlmTabsContent,
		HlmCardContent,
		HlmCardDescription,
		HlmCard,
		HlmCardFooter,
		HlmCardHeader,
		HlmCardTitle,
		HlmLabel,
		HlmInput,
		HlmButton,
	],
	host: {
		class: 'block w-full max-w-lg',
	},
	template: `
		<hlm-tabs tab="account" class="w-full">
			<hlm-tabs-list aria-label="tabs example">
				<button hlmTabsTrigger="account">Account</button>
				<button hlmTabsTrigger="password">Password</button>
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
		</hlm-tabs>
	`,
})
export class TabsPreview {}

export const defaultImports = `
import {
	HlmTabs
	HlmTabsContent
	HlmTabsList
	HlmTabsTrigger
} from '@spartan-ng/helm/tabs';
`;
export const defaultSkeleton = `
<hlm-tabs tab="account" class="w-full">
  <hlm-tabs-list class="grid w-full grid-cols-2" aria-label="tabs example">
    <button hlmTabsTrigger="account">Account</button>
    <button hlmTabsTrigger="password">Password</button>
  </hlm-tabs-list>
  <div hlmTabsContent="account">Make your account here</div>
  <div hlmTabsContent="password">Change your password here</div>
</hlm-tabs>
`;
