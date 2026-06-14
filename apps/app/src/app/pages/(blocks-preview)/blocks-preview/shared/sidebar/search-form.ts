import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-search-form',
	imports: [HlmSidebarImports, NgIcon, HlmLabel],
	providers: [provideIcons({ lucideSearch })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form>
			<hlm-sidebar-group class="py-0">
				<div hlmSidebarGroupContent class="relative">
					<label hlmLabel for="search" class="sr-only">Search</label>
					<input hlmSidebarInput id="search" placeholder="Search the docs..." class="pl-8" />
					<ng-icon
						name="lucideSearch"
						class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
					/>
				</div>
			</hlm-sidebar-group>
		</form>
	`,
})
export class SearchForm {}
