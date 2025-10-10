// breadcrumb.service.ts
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, type Data, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { type Breadcrumb, BreadcrumbSharedService } from './breadcrumb-shared.service';

@Injectable({
	providedIn: 'root',
})
export class BreadcrumbService {
	private readonly _router = inject(Router);
	private readonly _activatedRoute = inject(ActivatedRoute);
	private readonly _breadcrumbSharedService = inject(BreadcrumbSharedService);

	constructor() {
		this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
			const breadcrumbs = this.buildBreadcrumbs(this._activatedRoute.root);
			this._breadcrumbSharedService.updateBreadcrumbs(breadcrumbs);
		});
	}

	private buildBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
		const label = this.getLabel(route?.routeConfig?.data);
		let path = route?.routeConfig?.path ?? '';

		const routeParts = path.split('/');
		for (const part of routeParts) {
			const isDynamicRoute = part.startsWith(':');
			if (isDynamicRoute && !!route.snapshot) {
				const paramName = part.split(':')[1];
				path = path.replace(part, route.snapshot.params[paramName]);
			}
		}

		path = path.replace(/\*/g, '');
		const nextUrl = path ? `${url}/${path}` : url;

		const breadcrumb: Breadcrumb = {
			label: label,
			url: nextUrl,
			loading: !!route.snapshot.data['loading'],
			loadingLabel: route.snapshot.data['loadingLabel'] ?? 'Loading...',
		};
		const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
		if (route.firstChild) {
			return this.buildBreadcrumbs(route.firstChild, nextUrl, newBreadcrumbs);
		}
		return newBreadcrumbs;
	}

	private getLabel(data: Data | undefined): string {
		if (!data) return '';
		return typeof data['breadcrumb'] === 'function' ? data['breadcrumb'](data) : data['breadcrumb'];
	}
}
