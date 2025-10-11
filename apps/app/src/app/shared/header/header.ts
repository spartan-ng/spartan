import { afterNextRender, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub, lucideTwitter } from '@ng-icons/lucide';
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
	],
	providers: [provideIcons({ lucideTwitter, lucideGithub })],
	host: {
		class: 'bg-background sticky top-0 z-50 w-full',
	},
	template: `
		<div class="container-wrapper 3xl:fixed:px-0 px-6">
			<div class="3xl:fixed:container flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4">
				<a hlmBtn variant="ghost" class="mr-3 hidden p-1.5 lg:flex" routerLink="/">
					<spartan-logo class="w-14" />
					<span class="sr-only">spartan</span>
				</a>

				<spartan-mobile-nav class="lg:hidden" />

				<div class="hidden sm:space-x-2 lg:flex">
					<a spartanNavLink="/documentation">Docs</a>
					<a spartanNavLink="/stack">Stack</a>
					<a spartanNavLink="/components">Components</a>
					<a spartanNavLink="/examples">Examples</a>
				</div>

				<div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
					<div id="docsearch" class="mr-2.5"></div>
					<hlm-separator orientation="vertical" class="!h-4" />
					<a href="https://twitter.com/goetzrobin" target="_blank" size="sm" variant="ghost" hlmBtn>
						<span class="sr-only">Twitter</span>
						<ng-icon hlm name="lucideTwitter" size="sm" />
					</a>
					<hlm-separator orientation="vertical" class="!h-4" />
					<a href="https://github.com/goetzrobin/spartan" target="_blank" size="sm" variant="ghost" hlmBtn>
						<span class="sr-only">Github</span>
						<ng-icon hlm name="lucideGithub" size="sm" />
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
	constructor() {
		afterNextRender(async () => {
			const { default: docsearch } = await import('@docsearch/js');

			docsearch({
				container: '#docsearch',
				indexName: 'spartan-ng',
				appId: 'JJRQPPSU45',
				apiKey: '0fe1bcb9dbe76b2a149f00bc0709c5fd',
			});
		});
	}
}
