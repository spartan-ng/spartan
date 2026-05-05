import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

@Component({
	selector: 'spartan-empty-input-group',
	imports: [NgIcon, HlmEmptyImports, HlmInputGroupImports, HlmKbdImports],
	providers: [provideIcons({ lucideSearch })],
	template: `
		<hlm-empty>
			<hlm-empty-header>
				<div hlmEmptyTitle>404 - Not Found</div>
				<div hlmEmptyDescription>The page you're looking for doesn't exist. Try searching for what you need below.</div>
			</hlm-empty-header>
			<hlm-empty-content>
				<hlm-input-group class="sm:w-3/4">
					<input hlmInputGroupInput placeholder="Try searching for pages..." />
					<hlm-input-group-addon>
						<ng-icon name="lucideSearch" />
					</hlm-input-group-addon>
					<hlm-input-group-addon align="inline-end">
						<kbd hlmKbd>/</kbd>
					</hlm-input-group-addon>
				</hlm-input-group>
				<div hlmEmptyDescription>
					Need help?
					<a href="#">Contact Support</a>
				</div>
			</hlm-empty-content>
		</hlm-empty>
	`,
})
export class EmptyInputGroup {}
