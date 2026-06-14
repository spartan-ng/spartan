import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-opt-in-form',
	imports: [HlmSidebarImports, HlmButton, HlmCardImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-card class="gap-2 py-4 shadow-none">
			<hlm-card-header class="px-4">
				<hlm-card-title class="text-sm">Subscribe to our newsletter</hlm-card-title>
				<hlm-card-description>Opt-in to receive updates and news about the sidebar.</hlm-card-description>
			</hlm-card-header>
			<hlm-card-content class="px-4">
				<form>
					<div class="grid gap-2.5">
						<input hlmSidebarInput type="email" placeholder="Email" />
						<button hlmBtn class="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none" size="sm">
							Subscribe
						</button>
					</div>
				</form>
			</hlm-card-content>
		</hlm-card>
	`,
})
export class SidebarOptInForm {}
