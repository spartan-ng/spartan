import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideHouse, lucideInbox, lucideSearch, lucideSettings } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

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
	imports: [SidebarComponent, HlmSidebarImports],
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
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebarImports,
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
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  imports: [AppSidebar, HlmSidebarImports],
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
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [AppSidebar, HlmSidebarImports, RouterOutlet],
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
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports],
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
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { lucideCalendar, lucideHouse, lucideInbox, lucideSearch, lucideSettings } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebarImports,
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

export const provider = `
import { ApplicationConfig } from '@angular/core';
import { provideHlmSidebarConfig } from '@spartan-ng/helm/sidebar';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideHlmSidebarConfig({
      sidebarWidth: '18rem',
      sidebarWidthMobile: '16rem',
      sidebarWidthIcon: '4rem',
    })
  ],
};

`;

export const header = `
import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucideChevronDown } from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebarImports,
    HlmMenuImports,
    BrnMenuImports,
    NgIcon,
    HlmIcon,
  ],
  template: \`
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarHeader>
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <button hlmSidebarMenuButton [brnMenuTriggerFor]="menu">
                Select Workspace
                <ng-icon hlm name="lucideChevronDown" class="ml-auto" />
              </button>
              <ng-template #menu>
                <hlm-menu class="w-60">
                  <hlm-menu-label>Acme Inc</hlm-menu-label>
                  <hlm-menu-label>Acme Corp.</hlm-menu-label>
                </hlm-menu>
              </ng-template>
            </li>
          </ul>
        </div>
      </hlm-sidebar>
      <ng-content />
    </div>
  \`,
  providers: [
    provideIcons({
      lucideChevronDown,
    }),
  ],
})
export class AppSidebar {}
`;

export const footer = `
import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucideChevronUp } from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebarImports,
    HlmMenuImports,
    BrnMenuTrigger,
    NgIcon,
    HlmIcon,
  ],
  template: \`
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarHeader></div>
        <div hlmSidebarContent></div>
        <div hlmSidebarFooter>
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <button hlmSidebarMenuButton [brnMenuTriggerFor]="menu">
                Select Workspace
                <ng-icon hlm name="lucideChevronUp" class="ml-auto" />
              </button>
              <ng-template #menu>
                <hlm-menu class="w-60">
                  <hlm-menu-label>Account</hlm-menu-label>
                  <hlm-menu-label>Billing</hlm-menu-label>
                  <hlm-menu-label>Sign out</hlm-menu-label>
                </hlm-menu>
              </ng-template>
            </li>
          </ul>
        </div>
      </hlm-sidebar>
      <ng-content />
    </div>
  \`,
  providers: [
    provideIcons({
      lucideChevronUp,
    }),
  ],
})
export class AppSidebar {}
`;

export const content = `
import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports],
  template: \`
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarContent>
          <div hlmSidebarGroup></div>
          <div hlmSidebarGroup></div>
        </div>
      </hlm-sidebar>
      <ng-content />
    </div>
  \`,
})
export class AppSidebar {}`;

export const group = `
import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucidePlus } from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebarImports,
    NgIcon,
    HlmIcon,
  ],
  template: \`
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Application</div>
            <button hlmSidebarGroupAction>
              <ng-icon hlm name="lucidePlus" />
              <span class="sr-only">Add Project</span>
            </button>
            <div hlmSidebarGroupContent></div>
          </div>
        </div>
      </hlm-sidebar>
      <ng-content />
    </div>
  \`,
  providers: [
    provideIcons({
      lucidePlus,
    }),
  ],
})
export class AppSidebar {}
`;

export const collapsable = `
import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import {
  lucideChevronDown,
  lucideLifeBuoy,
  lucideSend,
} from '@ng-icons/lucide';
import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';

@Component({
  selector: 'app-sidebar',
  imports: [HlmIcon, NgIcon, BrnCollapsibleImports, HlmSidebarImports],
  template: \`
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarContent>
          <brn-collapsible [expanded]="true" class="group/collapsible">
            <div hlmSidebarGroup>
              <button
                brnCollapsibleTrigger
                hlmSidebarGroupLabel
                class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                Help
                <ng-icon
                  hlm
                  name="lucideChevronDown"
                  class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                />
              </button>
              <brn-collapsible-content>
                <div hlmSidebarGroupContent>
                  <ul hlmSidebarMenu>
                    <li hlmSidebarMenuItem>
                      <a hlmSidebarMenuButton>
                        <ng-icon hlm name="lucideLifeBuoy" />
                        <span>Support</span>
                      </a>
                    </li>
                    <li hlmSidebarMenuItem>
                      <a hlmSidebarMenuButton>
                        <ng-icon hlm name="lucideSend" />
                        <span>Feedback</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </brn-collapsible-content>
            </div>
          </brn-collapsible>
        </div>
      </hlm-sidebar>
      <ng-content />
    </div>
  \`,
  providers: [
    provideIcons({
      lucideLifeBuoy,
      lucideSend,
      lucideChevronDown,
    }),
  ],
})
export class AppSidebar {}
`;

export const groupAction = `
import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import {
  lucideChartPie,
  lucideFrame,
  lucideMap,
  lucidePlus,
} from '@ng-icons/lucide';
import { toast } from 'ngx-sonner';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HlmSidebarImports, NgIcon, HlmIcon, HlmToasterImports],
  template: \`
    <hlm-toaster />
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Projects</div>
            <button
              hlmSidebarGroupAction
              title="Add Project"
              (click)="_onAddProject()"
            >
              <ng-icon hlm name="lucidePlus" />
              <span class="sr-only">Add Project</span>
            </button>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton href="#">
                    <ng-icon hlm name="lucideFrame" />
                    <span>Design Engineering</span>
                  </a>
                </li>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton href="#">
                    <ng-icon hlm name="lucideChartPie" />
                    <span>Sales & Marketing</span>
                  </a>
                </li>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton href="#">
                    <ng-icon hlm name="lucideMap" />
                    <span>Travel</span>
                  </a>
                </li>
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
      lucideFrame,
      lucideChartPie,
      lucideMap,
      lucidePlus,
    }),
  ],
})
export class AppSidebar {
  protected _onAddProject(): void {
    toast.info('You clicked the group action!');
  }
}
`;

export const menu = `
import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import {
  lucideChartPie,
  lucideFrame,
  lucideLifeBuoy,
  lucideMap,
  lucideSend,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports, NgIcon, HlmIcon],
  template: \`
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Projects</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for (project of projects; track project){
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton [href]="project.url">
                    <ng-icon hlm [name]="project.icon" />
                    <span>{{ project.name }}</span>
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
      lucideFrame,
      lucideChartPie,
      lucideMap,
      lucideLifeBuoy,
      lucideSend,
    }),
  ],
})
export class AppSidebar {
  projects = [
    { name: 'Design Engineering', url: '#', icon: 'lucideFrame' },
    { name: 'Sales & Marketing', url: '#', icon: 'lucideChartPie' },
    { name: 'Travel', url: '#', icon: 'lucideMap' },
    { name: 'Support', url: '#', icon: 'lucideLifeBuoy' },
    { name: 'Feedback', url: '#', icon: 'lucideSend' },
  ];
}
`;

export const link = `
<li hlmSidebarMenuItem>
  <a hlmSidebarMenuButton href="#">
    Home
  </a>
</li>
`;
export const linkWithIcon = `
<li hlmSidebarMenuItem>
  <a hlmSidebarMenuButton href="#">
    <ng-icon hlm name="lucideHouse" />
    <span>Home</span>
  </a>
</li>
`;
export const linkActive = `
<li hlmSidebarMenuItem>
  <a hlmSidebarMenuButton href="#" isActive>
    Home
  </a>
</li>
`;

export const button = `
<li hlmSidebarMenuItem>
  <button hlmSidebarMenuButton>
    Send
  </button>
</li>
`;

export const menuAction = `
<li hlmSidebarMenuItem>
  <a hlmSidebarMenuButton href="#">
    <ng-icon hlm name="lucideHouse" />
    <span>Home</span>
  </a>
  <button hlmSidebarMenuAction>
    <ng-icon hlm name="lucidePlus" />
    <span class="sr-only">Add Project</span>
  </button>
</li>
`;

export const menuActionExample = `
import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import {
  lucideChartPie,
  lucideEllipsis,
  lucideFrame,
  lucideLifeBuoy,
  lucideMap,
  lucideSend,
} from '@ng-icons/lucide';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HlmSidebarImports, BrnMenuImports, NgIcon, HlmIcon, HlmMenuImports],
  template: \`
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Projects</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for (project of projects; track project){
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton [href]="project.url">
                    <ng-icon hlm [name]="project.icon" />
                    <span>{{ project.name }}</span>
                  </a>
                  <button hlmSidebarMenuAction [brnMenuTriggerFor]="menu">
                    <ng-icon hlm name="lucideEllipsis" />
                    <span class="sr-only">More</span>
                  </button>

                  <ng-template #menu>
                    <hlm-menu>
                      <button hlmMenuItem>Edit Project</button>
                      <button hlmMenuItem>Delete Project</button>
                    </hlm-menu>
                  </ng-template>
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
      lucideFrame,
      lucideChartPie,
      lucideMap,
      lucideLifeBuoy,
      lucideSend,
      lucideEllipsis,
    }),
  ],
})
export class AppSidebar {
  projects = [
    { name: 'Design Engineering', url: '#', icon: 'lucideFrame' },
    { name: 'Sales & Marketing', url: '#', icon: 'lucideChartPie' },
    { name: 'Travel', url: '#', icon: 'lucideMap' },
    { name: 'Support', url: '#', icon: 'lucideLifeBuoy' },
    { name: 'Feedback', url: '#', icon: 'lucideSend' },
  ];
}
`;
