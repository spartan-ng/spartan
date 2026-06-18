import { NgIcon, provideIcons } from '@ng-icons/core';
// breadcrumbs.component.ts
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { lucideChevronRight } from '@ng-icons/lucide';
import { BreadcrumbSharedService } from './breadcrumb-shared.service';

@Component({
	selector: 'spartan-breadcrumbs',
	imports: [RouterLink, NgIcon],
	providers: [provideIcons({ lucideChevronRight })],
	encapsulation: ViewEncapsulation.Emulated,
	template: `
		@if (breadcrumbs(); as breadcrumbs) {
			@if (breadcrumbs && breadcrumbs.length > 0) {
				<nav class="text-muted-foreground mb-4 flex items-center space-x-1 text-sm">
					<a
						class="focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
						[href]="breadcrumbs[0].url"
						[routerLink]="breadcrumbs[0].url"
					>
						{{ breadcrumbs[0].label }}
					</a>
					@for (breadcrumb of breadcrumbs.slice(1, breadcrumbs.length); track breadcrumb; let last = $last) {
						<ng-icon name="lucideChevronRight" />
						<a
							class="focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
							[class]="last ? 'text-foreground' : 'text-muted-foreground'"
							[href]="breadcrumb.url"
							[routerLink]="breadcrumb.url"
						>
							{{ breadcrumb.loading ? breadcrumb.loadingLabel : breadcrumb.label }}
						</a>
					}
				</nav>
			}
		}
	`,
})
export class Breadcrumbs {
	public readonly breadcrumbs = toSignal(inject(BreadcrumbSharedService).breadcrumbs$);
}
