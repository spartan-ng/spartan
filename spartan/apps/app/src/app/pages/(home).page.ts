import type { RouteMeta } from '@analogjs/router';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideStar } from '@ng-icons/lucide';
import { ZeropsLogo } from '@spartan-ng/app/app/pages/(home)/components/zerops-logo';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { metaWith } from '../shared/meta/meta.util';
import { AuthenticationExample } from './(home)/components/authentication/authentication';
import { DashboardExample } from './(home)/components/dashboard/dashboard';
import { OverviewExample } from './(home)/components/overview/overview';
import { PlaygroundExample } from './(home)/components/playground/playground';
import { TasksExample } from './(home)/components/tasks/tasks';
import { ThreeHundred } from './(home)/components/three-hundred';

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan - Cutting-edge tools powering Angular full-stack development',
		'Build next-level, full-stack applications with AnalogJs and the spartan/stack. Make them accessible and look incredible with spartan/ui.',
	),
	title: 'spartan - Cutting-edge tools powering Angular full-stack development',
};

const container = 'mx-auto flex flex-col items-center gap-4 text-center';
const subHeading =
	'text-primary leading-tighter max-w-4xl text-2xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-3xl xl:tracking-tighter';
const lead = 'text-foreground max-w-3xl text-base text-balance sm:text-lg';

@Component({
	selector: 'spartan-home',
	imports: [
		HlmButton,
		HlmIcon,
		RouterLink,
		HlmBadge,
		NgIcon,
		ThreeHundred,
		ZeropsLogo,
		HlmTabsImports,
		OverviewExample,
		DashboardExample,
		TasksExample,
		AuthenticationExample,
		PlaygroundExample,
	],
	providers: [provideIcons({ lucideStar, lucideArrowRight })],
	host: {
		class: 'block px-2',
	},
	template: `
		<section class="flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
			<div class="${container} max-w-[64rem]">
				<a target="_blank" href="https://zerops.io" hlmBadge variant="outline" class="border-none outline-none">
					<spartan-zerops-logo class="mr-0.5 h-3 w-3 fill-red-800 text-red-700" />
					Powered by Zerops. The dev-first cloud platform.
					<ng-icon hlm name="lucideArrowRight" />
				</a>
				<h1
					class="text-primary leading-tighter max-w-4xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter"
				>
					Stop fighting your component library.
				</h1>
				<p class="${lead} max-w-[42rem]">
					Accessible UI primitives for Angular - built with signals, SSR compatible, zoneless ready. Install the
					behavior. Copy the styles. Customize without limits.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<a hlmBtn size="sm" routerLink="/documentation">Get Started</a>
					<a hlmBtn size="sm" variant="ghost" routerLink="/components">View Components</a>
					<a
						hlmBtn
						size="sm"
						variant="ghost"
						target="_blank"
						rel="noreferrer"
						href="https://github.com/spartan-ng/spartan"
					>
						<ng-icon hlm size="sm" class="mr-0.5" name="lucideStar" />
						Star on GitHub
					</a>
				</div>
			</div>
		</section>

		<section class="container px-6">
			<hlm-tabs [tab]="_activeTab()" class="w-full">
				<hlm-tabs-list
					aria-label="tabs example"
					class="bg-background dark:[&>a]:bg-background [&>a]:text-muted-foreground [&>a]:data-[state=active]:text-primary [&>a]:hover:text-primary dark:[&>a]:data-[state=active]:bg-background [&>a]:cursor-pointer [&>a]:data-[state=active]:shadow-none dark:[&>a]:data-[state=active]:border-none"
				>
					<a hlmTabsTrigger="examples" routerLink=".">Examples</a>
					<a hlmTabsTrigger="dashboard" routerLink="." fragment="dashboard">Dashboard</a>
					<a hlmTabsTrigger="tasks" routerLink="." fragment="tasks">Tasks</a>
					<a hlmTabsTrigger="playground" routerLink="." fragment="playground">Playground</a>
					<a hlmTabsTrigger="authentication" routerLink="." fragment="authentication">Authentication</a>
				</hlm-tabs-list>
				<div hlmTabsContent="examples" class="mt-0">
					<spartan-overview-example />
				</div>
				<div hlmTabsContent="dashboard" class="mt-0">
					<spartan-dashboard-example />
				</div>
				<div hlmTabsContent="tasks" class="mt-0">
					<spartan-tasks-example />
				</div>
				<div hlmTabsContent="playground" class="mt-0">
					<spartan-playground-example />
				</div>
				<div hlmTabsContent="authentication" class="mt-0">
					<spartan-authentication-example />
				</div>
			</hlm-tabs>
		</section>

		<section id="the-300" class="space-y-6 py-8 md:py-12">
			<div class="${container} max-w-[58rem]">
				<h2 class="${subHeading}">Built By The 300</h2>
				<p class="${lead} max-w-[42rem]">
					Ready to make a difference? Join the first 300 and help shape the future of UI development with Angular &
					spartan.
				</p>
			</div>
			<div class="mx-auto space-y-12 text-center md:max-w-[64rem]">
				<spartan-three-hundred class="mt-12" />
				<p class="${lead} mx-auto max-w-[42rem]">
					Contribute code, share insights, or sponsor on GitHub. Let's build something extraordinary together!
				</p>
				<a hlmBtn size="lg" target="_blank" rel="noreferrer" href="https://github.com/spartan-ng/spartan">
					Claim your spot in the 300 today!
				</a>
			</div>
		</section>
	`,
})
export default class HomePage {
	protected readonly _route = inject(ActivatedRoute);
	protected readonly _activeTab = signal<string>(this._route.snapshot.fragment || 'examples');
}
