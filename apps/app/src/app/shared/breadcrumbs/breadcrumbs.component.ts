import { NgForOf, NgIf } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
// breadcrumbs.component.ts
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { BreadcrumbSharedService } from './breadcrumb-shared.service';

@Component({
	selector: 'spartan-breadcrumbs',
	imports: [RouterLink, NgIcon, HlmIconDirective, NgIf, NgForOf],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<ng-container *ngIf="breadcrumbs() as breadcrumbs">
			<nav
				*ngIf="breadcrumbs && breadcrumbs.length > 0"
				class="text-muted-foreground mb-4 flex items-center space-x-1 text-sm"
			>
				<a
					class="focus-visible:ring-ring rounded focus-visible:outline-none focus-visible:ring-2"
					[href]="breadcrumbs[0].url"
					[routerLink]="breadcrumbs[0].url"
				>
					{{ breadcrumbs[0].label }}
				</a>
				<ng-container *ngFor="let breadcrumb of breadcrumbs.slice(1, breadcrumbs.length); let last = last">
					<ng-icon hlm size="sm" name="lucideChevronRight" />
					<a
						class="focus-visible:ring-ring rounded focus-visible:outline-none focus-visible:ring-2"
						[class]="last ? 'text-foreground' : 'text-muted-foreground'"
						[href]="breadcrumb.url"
						[routerLink]="breadcrumb.url"
					>
						{{ breadcrumb.loading ? breadcrumb.loadingLabel : breadcrumb.label }}
					</a>
				</ng-container>
			</nav>
		</ng-container>
	`,
	encapsulation: ViewEncapsulation.Emulated,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
	public breadcrumbs = toSignal(inject(BreadcrumbSharedService).breadcrumbs$);
}
