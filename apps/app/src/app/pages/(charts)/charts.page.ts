import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { metaWith } from '../../shared/meta/meta.util';
import { chartSections } from './charts.examples';

const chartCard =
	'bg-card text-card-foreground scroll-mt-24 overflow-hidden rounded-xl border shadow-sm [&_tanstack-chart]:mx-auto';

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan/ui - Charts',
		'A collection of accessible Angular charts built with TanStack Charts and themed with spartan/ui.',
	),
	data: { breadcrumb: 'Charts' },
	title: 'spartan/ui - Charts',
};

@Component({
	selector: 'spartan-charts',
	imports: [RouterLink, HlmButton, HlmTabsImports, HlmChartImports, NgIcon],
	providers: [provideIcons({ lucideGithub })],
	template: `
		<section class="container flex flex-col items-center gap-4 py-12 text-center md:py-20">
			<h1
				class="text-primary leading-tighter max-w-4xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] xl:text-5xl xl:tracking-tighter"
			>
				Beautiful Charts for Angular
			</h1>
			<p class="text-foreground max-w-2xl text-base text-balance sm:text-lg">
				Ready-to-use chart patterns powered by TanStack Charts and styled with spartan/ui theme tokens.
			</p>
			<div class="flex flex-wrap justify-center gap-2 pt-2">
				<a hlmBtn size="sm" routerLink="/components/chart">Chart documentation</a>
				<a hlmBtn size="sm" variant="outline" routerLink="/charts" fragment="chart-gallery">Browse charts</a>
			</div>
		</section>

		<section id="chart-gallery" class="container-wrapper scroll-mt-20 px-6 pb-16">
			<hlm-tabs [tab]="_activeChart()" class="mb-6 w-full">
				<hlm-tabs-list
					aria-label="Chart types"
					class="bg-background dark:[&>a]:bg-background [&>a]:text-muted-foreground [&>a]:data-[state=active]:text-primary [&>a]:hover:text-primary dark:[&>a]:data-[state=active]:bg-background [&>a]:cursor-pointer [&>a]:data-[state=active]:shadow-none dark:[&>a]:data-[state=active]:border-none"
				>
					<a hlmTabsTrigger="area-charts" routerLink="/charts" fragment="area-charts">Area</a>
					<a hlmTabsTrigger="bar-charts" routerLink="/charts" fragment="bar-charts">Bar</a>
					<a hlmTabsTrigger="line-charts" routerLink="/charts" fragment="line-charts">Line</a>
					<a hlmTabsTrigger="pie-charts" routerLink="/charts" fragment="pie-charts">Pie</a>
					<a hlmTabsTrigger="radial-charts" routerLink="/charts" fragment="radial-charts">Radial</a>
				</hlm-tabs-list>
			</hlm-tabs>

			@let section = _activeSection();
			<section [id]="section.id" data-chart-section class="scroll-mt-24 space-y-5">
				<div class="flex items-start justify-between gap-4">
					<div>
						<h2 class="text-2xl font-semibold tracking-tight">{{ section.label }} Charts</h2>
						<p class="text-muted-foreground mt-1 text-sm">{{ section.description }}</p>
					</div>
					<a
						hlmBtn
						size="sm"
						href="https://github.com/spartan-ng/spartan/blob/main/apps/app/src/app/pages/(charts)/charts.examples.ts"
						target="_blank"
						rel="noreferrer"
					>
						Open in
						<ng-icon name="lucideGithub" />
					</a>
				</div>

				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					@for (example of section.examples; track example.title) {
						<article class="${chartCard}">
							<header class="border-b p-4">
								<h3 class="text-sm font-semibold">{{ example.title }}</h3>
								<p class="text-muted-foreground mt-1 text-xs">{{ example.description }}</p>
							</header>
							<div class="p-2">
								@defer (on viewport) {
									<tanstack-chart hlmChart [options]="$any(example.options)" />
								} @placeholder {
									<div class="aspect-video w-full" aria-hidden="true"></div>
								}
							</div>
						</article>
					}
				</div>
			</section>
		</section>
	`,
})
export default class ChartsPage {
	private readonly _fragment = toSignal(inject(ActivatedRoute).fragment);
	protected readonly _activeSection = computed(
		() => chartSections.find(({ id }) => id === this._fragment()) ?? chartSections[0],
	);
	protected readonly _activeChart = computed(() => this._activeSection().id);
}
