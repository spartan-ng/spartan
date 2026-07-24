import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'spartan-tabs-lazy',
	imports: [HlmTabsImports, HlmCardImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block w-full max-w-lg',
	},
	template: `
		<hlm-tabs tab="account" class="w-full">
			<hlm-tabs-list>
				<button hlmTabsTrigger="account">Account</button>
				<button hlmTabsTrigger="password">Password</button>
			</hlm-tabs-list>
			<div hlmTabsContent="account">
				<ng-template hlmTabsContentLazy>
					<section hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Account</h3>
							<p hlmCardDescription>This content was lazily loaded when the tab was first activated.</p>
						</div>
						<p hlmCardContent>Account content loaded lazily.</p>
					</section>
				</ng-template>
			</div>
			<div hlmTabsContent="password">
				<ng-template hlmTabsContentLazy>
					<section hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Password</h3>
							<p hlmCardDescription>This content was lazily loaded when the tab was first activated.</p>
						</div>
						<p hlmCardContent>Password content loaded lazily.</p>
					</section>
				</ng-template>
			</div>
		</hlm-tabs>
	`,
})
export class TabsLazyPreview {}
