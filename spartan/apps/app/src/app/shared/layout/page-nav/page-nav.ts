import { NgClass } from '@angular/common';
import {
	type AfterViewInit,
	Component,
	computed,
	ElementRef,
	inject,
	isDevMode,
	type OnDestroy,
	signal,
	type TemplateRef,
	viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ApiDocsService } from '@spartan-ng/app/app/core/services/api-docs.service';
import { PageNavZeropsAd } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav-zerops-ad';
import { HlmScrollArea } from '@spartan-ng/helm/scroll-area';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PageNavLink } from './page-nav-link';
import { pageNavTmpl } from './page-nav-outlet';

type SamePageAnchorLink = {
	id: string;
	label: string;
	isNested: boolean;
};

@Component({
	selector: 'spartan-page-nav',

	imports: [HlmScrollArea, NgScrollbarModule, NgClass, PageNavLink, PageNavZeropsAd],
	host: {
		class: 'hidden max-w-sm xl:block text-sm',
	},
	template: `
		<ng-template #pageNav>
			@if (_computedLinks().length > 0) {
				<div class="h-(--top-spacing) shrink-0"></div>
				<div>
					<p class="text-muted-foreground bg-background px-4 pb-2 text-xs">On This Page</p>
					<ng-scrollbar hlm class="h-[calc(100svh-14rem-var(--footer-height)+2rem-var(--stable-height))] py-2">
						<div class="flex flex-col gap-2 p-4 pt-0 text-sm">
							@for (link of _computedLinks(); track link.id) {
								<spartan-page-nav-link
									[ngClass]="{ 'pl-4': link.isNested }"
									[fragment]="link.id"
									[label]="link.label"
								/>
							}
						</div>
					</ng-scrollbar>
					<div class="flex items-center justify-center px-4">
						<spartan-page-nav-zerops-ad />
					</div>
				</div>
			} @else {
				@if (_isDevMode()) {
					<div>[DEV] Nothing to see here!</div>
				}
				<div class="px-4">
					<spartan-page-nav-zerops-ad />
				</div>
			}
		</ng-template>
	`,
})
export class PageNav implements AfterViewInit, OnDestroy {
	public readonly pageNavTpl = viewChild.required<TemplateRef<unknown>>('pageNav');

	private readonly _route = inject(ActivatedRoute);
	private readonly _routeData = toSignal(this._route.data);
	private readonly _apiDocsService = inject(ApiDocsService, { optional: true });

	protected readonly _isDevMode = signal(isDevMode());

	protected readonly _links = computed<SamePageAnchorLink[]>(() => {
		const selectors = ['[spartanMainSection] spartan-section-sub-heading', '[spartanMainSection] > h3'];
		const headings = Array.from(this._page?.querySelectorAll(selectors.join(',')) ?? []);
		const links = headings.map((element) => {
			const { id, children, localName, textContent } = element;
			const isSubHeading = localName === 'spartan-section-sub-heading';
			const label =
				(isSubHeading ? (children?.[0]?.childNodes?.[0]?.textContent ?? '[DEV] Empty heading!') : textContent) ??
				'[DEV] Empty heading!';
			if (this._isDevMode() && id === '') {
				console.error(`[DEV] id missing for heading "${label}"`);
			}
			return { id, label, isNested: !isSubHeading };
		});

		return links;
	});

	protected readonly _dynamicLinks = computed(() => {
		const apiComponent = this._routeData()?.['api'];
		if (!apiComponent || !this._apiDocsService) {
			return this._links();
		}

		const apiPageLinks = this._apiDocsService.getComponentHeaders(apiComponent);
		if (!apiPageLinks?.length) {
			return this._links();
		}

		const pageLinks = [...this._links()];

		// Find indices for API sections
		const brnLinkIndex = pageLinks.findIndex((link) => link.id === 'brn-api');

		// Split links by type
		const brainLinks = apiPageLinks
			.filter((link) => link.type === 'brain')
			.map((link) => ({
				id: link.id,
				label: link.label,
				isNested: true,
			}));

		const helmLinks = apiPageLinks
			.filter((link) => link.type === 'helm')
			.map((link) => ({
				id: link.id,
				label: link.label,
				isNested: true,
			}));

		// Only insert links if they exist
		if (brainLinks.length) {
			pageLinks.splice(brnLinkIndex + 1, 0, ...brainLinks);
		}

		// Recalculate helm index since it may have shifted after inserting brain links
		const newHlmIndex = pageLinks.findIndex((link) => link.id === 'hlm-api');
		if (helmLinks.length && newHlmIndex !== -1) {
			pageLinks.splice(newHlmIndex + 1, 0, ...helmLinks);
		}

		return pageLinks;
	});

	protected readonly _computedLinks = computed(() =>
		this._dynamicLinks() && this._dynamicLinks().length ? this._dynamicLinks() : this._links(),
	);

	/**
	 * Reference to the tag with the main content of the page.
	 * For this to work, the component should be added immediately after a tag with the [spartanMainSection] directive.
	 */
	private readonly _page: HTMLElement = (inject(ElementRef).nativeElement as HTMLElement)
		.previousSibling as HTMLElement;

	ngAfterViewInit(): void {
		if (!this.pageNavTpl()) return;
		pageNavTmpl.set(this.pageNavTpl());
	}

	ngOnDestroy(): void {
		pageNavTmpl.set(null);
	}
}
