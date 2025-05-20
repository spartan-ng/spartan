import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideLayers, lucidePuzzle, lucideStar } from '@ng-icons/lucide';
import { ZeropsLogoComponent } from '@spartan-ng/app/app/pages/(home)/components/zerops-logo.component';
import { HlmBadgeDirective } from '@spartan-ng/helm/badge';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import {
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/helm/card';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { metaWith } from '../shared/meta/meta.util';
import { ThreeHundredComponent } from './(home)/components/three-hundred.component';

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan - Cutting-edge tools powering Angular full-stack development',
		'Build next-level, full-stack applications with AnalogJs and the spartan/stack. Make them accessible and look incredible with spartan/ui.',
	),
	title: 'spartan - Cutting-edge tools powering Angular full-stack development',
};

const container = 'mx-auto flex flex-col items-center gap-4 text-center';
const subHeading = 'font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl';
const lead = 'leading-normal text-muted-foreground sm:text-xl sm:leading-8';

@Component({
	selector: 'spartan-home',
	imports: [
		HlmButtonDirective,
		RouterLink,
		HlmBadgeDirective,
		HlmCardDirective,
		HlmCardHeaderDirective,
		HlmCardTitleDirective,
		HlmCardDescriptionDirective,
		NgIcon,
		HlmIconDirective,
		ThreeHundredComponent,
		ZeropsLogoComponent,
	],
	host: {
		class: 'block p-4 pb-12 pt-6 sm:pb-24 sm:pt-12',
	},
	providers: [provideIcons({ lucideLayers, lucidePuzzle, lucideStar, lucideCheck })],
	template: `
		<section class="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
			<div class="${container} max-w-[64rem]">
				<a
					target="_blank"
					href="https://zerops.io"
					hlmBadge
					class="!bg-primary !text-foreground-primary !hover:bg-primary/90"
				>
					Proudly supported by Zerops. The dev-first cloud platform.
					<spartan-zerops-logo class="ml-1.5 mr-1 h-4 w-4" />
				</a>
				<h1 class="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
					Cutting-edge tools powering Angular full-stack development.
				</h1>
				<p class="${lead} max-w-[42rem]">
					Build next-level, full-stack applications with AnalogJs and the spartan/stack. Make them accessible and look
					incredible with spartan/ui.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<a hlmBtn size="lg" routerLink="/documentation">Get Started</a>
					<a
						hlmBtn
						size="lg"
						variant="outline"
						target="_blank"
						rel="noreferrer"
						href="https://github.com/goetzrobin/spartan"
					>
						Star on GitHub
						<ng-icon hlm size="sm" class="ml-2" name="lucideStar" />
					</a>
				</div>
			</div>
		</section>

		<section id="tools" class="space-y-6 py-8 md:py-12 lg:py-24">
			<div class="${container} max-w-[58rem]">
				<h2 class="${subHeading}">The Tools</h2>
				<p class="${lead} max-w-[42rem]">
					spartan provides you with an opinionated stack set up with a single command and a set of accessible UI
					primitives.
				</p>
			</div>
			<div class="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem]">
				<a routerLink="/stack" hlmCard class="group">
					<div hlmCardHeader>
						<ng-icon hlm class="group-hover:text-primary transition-colors" name="lucideLayers" size="xl" />
						<h3 hlmCardTitle>spartan/stack</h3>
						<p hlmCardDescription>
							Opinionated full-stack based on Supabase, Angular, tRPC, Tailwind, AnalogJs, Nx and Drizzle.
						</p>
					</div>
				</a>

				<a routerLink="/documentation/installation" hlmCard class="group">
					<div hlmCardHeader>
						<ng-icon hlm class="group-hover:text-primary transition-colors" name="lucidePuzzle" size="xl" />
						<h3 hlmCardTitle>spartan/ui</h3>
						<p hlmCardDescription>Accessible, composable UI primitives that come styled or unstyled.</p>
					</div>
				</a>
			</div>
		</section>

		<section id="the-300" class="space-y-6 py-8 md:py-12 lg:py-24">
			<div class="${container} max-w-[58rem]">
				<h2 class="${subHeading}">The 300</h2>
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
				<a hlmBtn size="lg" target="_blank" rel="noreferrer" href="https://github.com/goetzrobin/spartan">
					Claim your spot in the 300 today!
				</a>
			</div>
		</section>

		<section id="zerops" class="space-y-6 py-8 md:py-12 lg:py-24">
			<div class="${container} max-w-[58rem]">
				<h2 class="${subHeading}">Spearheading Our Development</h2>
				<p class="${lead} max-w-[42rem]">
					spartan.ng is made possible by our partnership with
					<a target="_blank" href="https://zerops.io" class="text-foreground font-semibold">Zerops.</a>
					Their developer-first cloud platform aligns perfectly with our mission to create exceptional Angular
					components and further our ecosystem.
				</p>

				<ul class="mb-8 mt-4 space-y-2">
					@for (valueProp of valueProps; track $index) {
						<li class="flex items-start gap-2">
							<ng-icon name="lucideCheck" class="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
							<span>{{ valueProp }}</span>
						</li>
					}
				</ul>
			</div>
			<div class="mx-auto justify-center md:max-w-[50rem]">
				<div hlmCard class="group block">
					<div hlmCardHeader>
						<spartan-zerops-logo class="fill-foreground/60 text-foreground block h-12 w-12 transition-colors" />
						<h3 hlmCardTitle>Why Zerops?</h3>
						<p hlmCardDescription>
							What sets Zerops apart is their dedication to simplifying the developer experience—eliminating deployment
							complexity so teams can focus on building great software. This philosophy mirrors our own commitment to
							creating components that are both powerful and easy to implement.
						</p>
					</div>
				</div>
				<div class="mx-auto p-12 text-center md:max-w-[64rem]">
					<a hlmBtn size="lg" target="_blank" href="https://zerops.io">Learn How Zerops Can Help Your Team</a>
				</div>
			</div>
		</section>
	`,
})
export default class HomePageComponent {
	protected readonly valueProps = [
		'Our core development team now receives the compensation they deserve',
		'Component development has accelerated significantly on our path to v1',
		"We're building production-ready templates that showcase real-world implementation",
		'The project has gained long-term sustainability beyond volunteer contributions',
	];
}
