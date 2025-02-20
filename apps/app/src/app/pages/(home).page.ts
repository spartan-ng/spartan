import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayers, lucidePuzzle, lucideStar } from '@ng-icons/lucide';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
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
	],
	host: {
		class: 'block p-4 pb-12 pt-6 sm:pb-24 sm:pt-12',
	},
	providers: [provideIcons({ lucideLayers, lucidePuzzle, lucideStar })],
	template: `
		<section class="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
			<div class="${container} max-w-[64rem]">
				<a
					target="_blank"
					href="https://github.com/goetzrobin/spartan"
					hlmBadge
					class="!bg-primary !text-foreground-primary !hover:bg-primary/90"
				>
					This is madness. This is spartan.
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

		<section id="tools" class="space-y-6 py-8 md:py-12 lg:py-24">
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
	`,
})
export default class HomePageComponent {}
