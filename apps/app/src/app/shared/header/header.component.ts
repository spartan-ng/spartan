import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub, lucideTwitter } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { SpartanLogoComponent } from '../spartan-logo.component';
import { NavLinkDirective } from '../spartan-nav-link.directive';
import { HeaderDarkModeComponent } from './header-dark-mode.component';
import { HeaderMobileNavComponent } from './header-mobile-nav.component';

@Component({
	selector: 'spartan-header',
	imports: [
		HlmButtonDirective,
		RouterLink,
		NgIcon,
		HlmIconDirective,
		NavLinkDirective,
		HeaderMobileNavComponent,
		HeaderDarkModeComponent,
		SpartanLogoComponent,
	],
	providers: [provideIcons({ lucideTwitter, lucideGithub })],
	host: {
		class: 'block sticky w-full top-0 z-40 bg-background/95 bg-blur-lg p-2 sm:px-4 border-b border-border',
	},
	template: `
		<div class="mx-auto flex w-full max-w-screen-xl items-center justify-between">
			<nav class="flex items-center">
				<a hlmBtn variant="ghost" class="mr-3 hidden p-1.5 sm:flex" routerLink="/">
					<spartan-logo class="w-14" />
					<span class="sr-only">spartan</span>
				</a>

				<spartan-mobile-nav class="sm:hidden" />

				<div class="hidden sm:flex sm:space-x-2">
					<a spartanNavLink="/documentation">Documentation</a>
					<a spartanNavLink="/stack">Stack</a>
					<a spartanNavLink="/components">Components</a>
					<a spartanNavLink="/examples">Examples</a>
				</div>
			</nav>

			<div class="flex space-x-2">
				<a href="https://twitter.com/goetzrobin" target="_blank" size="sm" variant="ghost" hlmBtn>
					<span class="sr-only">Twitter</span>
					<ng-icon hlm name="lucideTwitter" size="sm" />
				</a>
				<a href="https://github.com/goetzrobin/spartan" target="_blank" size="sm" variant="ghost" hlmBtn>
					<span class="sr-only">Github</span>
					<ng-icon hlm name="lucideGithub" size="sm" />
				</a>
				<spartan-dark-mode />
			</div>
		</div>
	`,
})
export class HeaderComponent {}
