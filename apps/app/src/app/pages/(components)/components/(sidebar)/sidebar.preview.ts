import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideHouse, lucideInbox, lucideSearch, lucideSettings } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports, HlmSidebarInset, HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar',
	imports: [HlmSidebarImports, NgIcon, HlmIcon],
	template: `
		<div hlmSidebarWrapper>
			<hlm-sidebar>
				<div hlmSidebarContent>
					<div hlmSidebarGroup>
						<div hlmSidebarGroupLabel>Application</div>
						<div hlmSidebarGroupContent>
							<ul hlmSidebarMenu>
								@for (item of _items; track item.title) {
									<li hlmSidebarMenuItem>
										<a hlmSidebarMenuButton>
											<ng-icon hlm [name]="item.icon" />
											<span>{{ item.title }}</span>
										</a>
									</li>
								}
							</ul>
						</div>
					</div>
				</div>
			</hlm-sidebar>
			<ng-content />
		</div>
	`,
	providers: [
		provideIcons({
			lucideHouse,
			lucideInbox,
			lucideCalendar,
			lucideSearch,
			lucideSettings,
		}),
	],
})
export class SidebarComponent {
	protected readonly _items = [
		{
			title: 'Home',
			url: '#',
			icon: 'lucideHouse',
		},
		{
			title: 'Inbox',
			url: '#',
			icon: 'lucideInbox',
		},
		{
			title: 'Calendar',
			url: '#',
			icon: 'lucideCalendar',
		},
		{
			title: 'Search',
			url: '#',
			icon: 'lucideSearch',
		},
		{
			title: 'Settings',
			url: '#',
			icon: 'lucideSettings',
		},
	];
}

@Component({
	imports: [SidebarComponent, HlmSidebarInset, HlmSidebarTrigger],
	selector: 'spartan-sidebar-preview',

	template: `
		<spartan-sidebar>
			<main hlmSidebarInset>
				<header class="flex h-12 items-center justify-between px-4">
					<button hlmSidebarTrigger><span class="sr-only"></span></button>
				</header>
			</main>
		</spartan-sidebar>
	`,
})
export class SidebarPreviewComponent {}

export const cssCode = `
@layer base {
  :root {
   	--sidebar: 300 0% 98%;
	--sidebar-foreground: 300 0% 4%;
	--sidebar-primary: 330 0% 9%;
	--sidebar-primary-foreground: 300 0% 98%;
	--sidebar-accent: 300 0% 96%;
	--sidebar-accent-foreground: 330 0% 9%;
	--sidebar-border: 330 0% 90%;
	--sidebar-ring: 0 0% 63%;
  }

  .dark {
    --sidebar: 300 0% 98%;
	--sidebar-foreground: 300 0% 4%;
	--sidebar-primary: 330 0% 9%;
	--sidebar-primary-foreground: 300 0% 98%;
	--sidebar-accent: 300 0% 96%;
	--sidebar-accent-foreground: 330 0% 9%;
	--sidebar-border: 330 0% 90%;
	--sidebar-ring: 0 0% 63%;
  }
}
`;

export const usageLayout = `
import { Component } from '@angular/core';
import {
  HlmSidebar,
  HlmSidebarContent,
  HlmSidebarFooter,
  HlmSidebarGroup,
  HlmSidebarHeader,
  HlmSidebarWrapper,
} from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebar,
    HlmSidebarContent,
    HlmSidebarFooter,
    HlmSidebarGroup,
    HlmSidebarHeader,
    HlmSidebarWrapper,
  ],
  template: \`
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarHeader></div>
        <div hlmSidebarContent>
          <div hlmSidebarGroup></div>
          <div hlmSidebarGroup></div>
        </div>
        <div hlmSidebarFooter></div>
      </hlm-sidebar>
      <ng-content />
    </div>
  \`,
})
export class AppSidebar {}
`;

export const usageApp = `
import { Component } from '@angular/core';
import { AppSidebar } from './app-sidebar';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';

@Component({
  imports: [AppSidebar, HlmSidebarTrigger],
  selector: 'app-root',
  template: \`<app-sidebar>
    <main>
      <button hlmSidebarTrigger><span class="sr-only"></span></button>
    </main>
  </app-sidebar>\`,
})
export class App {}

`;

export const firstSidebarApp = `
import { Component } from '@angular/core';
import { AppSidebar } from './app-sidebar';
import { HlmSidebarInset, HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [AppSidebar, HlmSidebarTrigger, HlmSidebarInset, RouterOutlet],
  selector: 'app-root',
  template: \`<app-sidebar>
    <main hlmSidebarInset>
      <header class="flex h-12 items-center justify-between px-4">
        <button hlmSidebarTrigger><span class="sr-only"></span></button>
        <router-outlet/>
      </header>
    </main>
  </app-sidebar>\`,
})
export class App {}
`;

export const firstSidebarInitial = `
import { Component } from '@angular/core';
import {
  HlmSidebar,
  HlmSidebarContent,
	HlmSidebarWrapper
} from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-sidebar',
  imports: [
  	HlmSidebarWrapper,
    HlmSidebar,
    HlmSidebarContent,
  ],
  template: \`
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarContent>
        </div>
      </hlm-sidebar>
      <ng-content />
    </div>
  \`,
})
export class AppSidebar {}
`;

export const firstSidebar = `
import { Component } from '@angular/core';
import {
  HlmSidebar,
  HlmSidebarContent,
  HlmSidebarGroup,
  HlmSidebarGroupContent,
  HlmSidebarGroupLabel,
  HlmSidebarMenu,
  HlmSidebarMenuButton,
  HlmSidebarMenuItem,
  HlmSidebarWrapper
} from '@spartan-ng/helm/sidebar';
import { lucideCalendar, lucideHouse, lucideInbox, lucideSearch, lucideSettings } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebar,
    HlmSidebarContent,
    HlmSidebarGroup,
    HlmSidebarWrapper,
    HlmSidebarGroupLabel,
    HlmSidebarGroupContent,
    HlmSidebarMenu,
    HlmSidebarMenuItem,
    HlmSidebarMenuButton,
    NgIcon,
    HlmIcon,
  ],
  template: \`
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Application</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for(item of _items; track item.title){
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton>
                    <ng-icon hlm [name]="item.icon" />
                    <span>{{ item.title }}</span>
                  </a>
                </li>
                }
              </ul>
            </div>
          </div>
        </div>
      </hlm-sidebar>
      <ng-content />
    </div>
  \`,
  providers: [
    provideIcons({
      lucideHouse,
      lucideInbox,
      lucideCalendar,
      lucideSearch,
      lucideSettings,
    }),
  ],
})
export class AppSidebar {
  protected readonly _items = [
    {
      title: 'Home',
      url: '#',
      icon: 'lucideHouse',
    },
    {
      title: 'Inbox',
      url: '#',
      icon: 'lucideInbox',
    },
    {
      title: 'Calendar',
      url: '#',
      icon: 'lucideCalendar',
    },
    {
      title: 'Search',
      url: '#',
      icon: 'lucideSearch',
    },
    {
      title: 'Settings',
      url: '#',
      icon: 'lucideSettings',
    },
  ];
}
`;
