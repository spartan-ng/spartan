import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideX } from '@ng-icons/lucide';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/brain/sheet';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmScrollAreaDirective } from '@spartan-ng/ui-scrollarea-helm';
import { HlmSheetImports } from '@spartan-ng/ui-sheet-helm';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SideNavContentComponent } from '../layout/side-nav/side-nav-content.component';
import { SideNavLinkDirective } from '../layout/side-nav/side-nav-link.directive';
import { SpartanLogoComponent } from '../spartan-logo.component';
import { NavLinkDirective } from '../spartan-nav-link.directive';

@Component({
	selector: 'spartan-mobile-nav',
	standalone: true,
	imports: [
		BrnSheetTriggerDirective,
		BrnSheetContentDirective,
		HlmSheetImports,

		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
		SideNavContentComponent,
		HlmScrollAreaDirective,
		NgScrollbarModule,
		RouterLink,
		NavLinkDirective,
		SideNavLinkDirective,
		SpartanLogoComponent,
	],
	providers: [provideIcons({ lucideMenu, lucideX })],
	template: `
		<hlm-sheet side="left" closeDelay="100">
			<button size="sm" id="menu-trigger" variant="ghost" brnSheetTrigger hlmBtn>
				<ng-icon hlm name="lucideMenu" size="sm" />
				<span class="sr-only">Open menu</span>
			</button>
			<hlm-sheet-content class="pb-0 pr-0" *brnSheetContent="let ctx">
				<div class="flex items-center pb-2">
					<a (click)="ctx.close()" hlmBtn variant="ghost" class="mr-4 p-1.5" routerLink="/">
						<spartan-logo class="text-primary w-12" />
					</a>
					<span>spartan/ui</span>
				</div>
				<ng-scrollbar hlm class="h-[calc(100vh-8rem)]">
					<div class="flex flex-col space-y-1 p-2 pb-4">
						<a (click)="ctx.close()" class="text-foreground px-2 py-1 hover:underline" routerLink="/documentation">
							Documentation
						</a>
						<a (click)="ctx.close()" class="text-foreground px-2 py-1 hover:underline" routerLink="/stack">Stack</a>
						<a (click)="ctx.close()" class="text-foreground px-2 py-1 hover:underline" routerLink="/components">
							Components
						</a>
						<a (click)="ctx.close()" class="text-foreground px-2 py-1 hover:underline" routerLink="/examples">
							Examples
						</a>
					</div>
					<spartan-side-nav-content (linkClicked)="ctx.close()" />
				</ng-scrollbar>
			</hlm-sheet-content>
		</hlm-sheet>
	`,
})
export class HeaderMobileNavComponent {}
