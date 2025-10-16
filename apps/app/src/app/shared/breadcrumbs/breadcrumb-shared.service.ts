// breadcrumb-shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
	label: string;
	url: string;
	loading: boolean;
	loadingLabel?: string;
}

@Injectable({
	providedIn: 'root',
})
export class BreadcrumbSharedService {
	private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

	// Observable exposing the breadcrumb hierarchy
	public readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

	updateBreadcrumbs(breadcrumbs: Breadcrumb[]) {
		this._breadcrumbs$.next(breadcrumbs);
	}

	updateCurrentBreadcrumbData(newData: Partial<Breadcrumb>) {
		const newBreadcrumbs = [...this._breadcrumbs$.getValue()];
		newBreadcrumbs[newBreadcrumbs.length - 1] = {
			...newBreadcrumbs[newBreadcrumbs.length - 1],
			...newData,
		};
		this._breadcrumbs$.next(newBreadcrumbs);
	}
}
