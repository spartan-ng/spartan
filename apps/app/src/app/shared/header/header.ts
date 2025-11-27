import { httpResource } from '@angular/common/http';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub, lucideTwitter } from '@ng-icons/lucide';
import { DocsDialog } from '@spartan-ng/app/app/shared/header/docs-dialog';
import { HeaderLayoutMode } from '@spartan-ng/app/app/shared/header/header-layout-mode';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { SpartanLogo } from '../spartan-logo';
import { NavLink } from '../spartan-nav-link';
import { HeaderDarkMode } from './header-dark-mode';
import { HeaderMobileNav } from './header-mobile-nav';

@Component({
	selector: 'spartan-header',
	imports: [
		HlmButton,
		RouterLink,
		NgIcon,
		HlmIcon,
		NavLink,
		HeaderMobileNav,
		HeaderDarkMode,
		SpartanLogo,
		HlmSeparatorImports,
		HeaderLayoutMode,

		DocsDialog,
	],
	providers: [provideIcons({ lucideTwitter, lucideGithub })],
	host: {
		class: 'backdrop-blur-sm sticky top-0 z-50 w-full',
	},
	template: `
		<div class="container-wrapper 3xl:fixed:px-0 px-6">
			<div class="3xl:fixed:container flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4">
				<a hlmBtn variant="ghost" class="hidden p-1.5 lg:flex" routerLink="/">
					<spartan-logo class="w-14" />
					<span class="sr-only">spartan</span>
				</a>

				<spartan-mobile-nav class="lg:hidden" />

				<div class="hidden sm:space-x-2 lg:flex">
					<a spartanNavLink="/documentation">Docs</a>
					<a spartanNavLink="/components">Components</a>
					<a spartanNavLink="/blocks">Blocks</a>
					<a spartanNavLink="/colors">Colors</a>
					<a spartanNavLink="/stack">Stack</a>
				</div>

				<div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
					<spartan-docs-dialog class="hidden w-full flex-1 md:flex md:w-auto md:flex-none" />
					<hlm-separator orientation="vertical" class="!h-4" />
					<a href="https://twitter.com/goetzrobin" target="_blank" size="sm" variant="ghost" hlmBtn>
						<span class="sr-only">Twitter</span>
						<ng-icon hlm name="lucideTwitter" size="sm" />
					</a>
					<hlm-separator orientation="vertical" class="!h-4" />
					<a href="https://github.com/spartan-ng/spartan" target="_blank" size="sm" variant="ghost" hlmBtn>
						<ng-icon hlm name="lucideGithub" size="sm" />
						<span class="text-muted-foreground text-xs">{{ _stars() }}</span>
					</a>
					<hlm-separator orientation="vertical" class="!h-4" />
					<spartan-layout-mode class="3xl:flex hidden" />
					<spartan-dark-mode />
				</div>
			</div>
		</div>
	`,
})
export class Header {
	private readonly _githubInfo = httpResource<{ stars: number }>(() => '/api/github-info');

	protected readonly _stars = computed(() => {
		const count = this._githubInfo.value()?.stars ?? 0;
		if (count < 1000) return count.toString();
		// Divide by 1000, round down to the nearest tenth, and format as "k"
		const rounded = Math.floor((count / 1000) * 10) / 10;
		return `${rounded}k`;
	});
}
