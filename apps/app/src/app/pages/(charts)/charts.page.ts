import type { RouteMeta } from '@analogjs/router';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { filter, map } from 'rxjs/operators';
import { charts } from '../../shared/components/navigation-items';
import { metaWith } from '../../shared/meta/meta.util';
import { ChartCodeDrawer } from './charts/_lib/chart-code-drawer';

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan/ui - Charts',
		'Beautiful charts built with Angular and d3, styled to match shadcn/ui. Copy, paste, and make them yours.',
	),
	data: {
		breadcrumb: 'Charts',
	},
	title: 'spartan/ui - Charts',
};

// Charts use their own layout: the app header/footer come from the root shell, but the body is a
// full-width ShadCN-style showcase (centered hero + chart-type nav + card grid) instead of the docs
// sidebar. The active tab is derived from the URL (rather than routerLinkActive) so it is correct on
// first paint under OnPush + SSR hydration.
@Component({
	selector: 'spartan-charts',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterOutlet, RouterLink, HlmButtonImports, ChartCodeDrawer],
	template: `
		<div class="container-wrapper">
			<div class="container py-10 md:py-14">
				<div class="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
					<span
						class="border-border bg-muted/40 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
					>
						<span class="size-1.5 rounded-full bg-amber-500"></span>
						Charts are in Alpha
					</span>
					<h1 class="text-3xl font-bold tracking-tight text-balance md:text-5xl">Beautiful Charts</h1>
					<p class="text-muted-foreground max-w-2xl text-base text-balance md:text-lg">
						Built with Angular and d3, styled to match shadcn/ui. Copy, paste, and make them yours.
					</p>
					<div class="mt-2 flex flex-wrap items-center justify-center gap-2">
						<a hlmBtn size="sm" href="#charts" (click)="onBrowse($event)">Browse Charts</a>
						<a hlmBtn size="sm" variant="outline" routerLink="/components/charts">Documentation</a>
					</div>
				</div>

				<nav id="charts" class="no-scrollbar mt-10 flex scroll-mt-24 gap-1 overflow-x-auto">
					@for (chart of _charts; track chart.url) {
						<a
							[routerLink]="'/charts' + chart.url"
							class="rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
							[class.bg-muted]="_isActive(chart.url)"
							[class.text-foreground]="_isActive(chart.url)"
							[class.text-muted-foreground]="!_isActive(chart.url)"
							[class.hover:text-foreground]="!_isActive(chart.url)"
						>
							{{ chart.label }}
						</a>
					}
				</nav>

				<div class="mt-20 pb-12">
					<router-outlet />
				</div>
			</div>
		</div>
		<charts-code-drawer />
	`,
})
export default class ChartsPage {
	protected readonly _charts = charts;
	private readonly _router = inject(Router);
	private readonly _currentUrl = toSignal(
		this._router.events.pipe(
			filter((e): e is NavigationEnd => e instanceof NavigationEnd),
			map(() => this._router.url),
		),
		{ initialValue: this._router.url },
	);

	private readonly _document = inject(DOCUMENT);

	protected _isActive(url: string): boolean {
		const path = this._currentUrl().split('?')[0].split('#')[0];
		return path.startsWith('/charts' + url);
	}

	protected onBrowse(event: Event): void {
		event.preventDefault();
		this._document.getElementById('charts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
}
