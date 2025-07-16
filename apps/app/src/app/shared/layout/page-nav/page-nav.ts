import { NgClass, isPlatformServer } from '@angular/common';
import {
	type AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	type OnDestroy,
	type OnInit,
	PLATFORM_ID,
	TemplateRef,
	computed,
	inject,
	isDevMode,
	signal,
	viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ApiDocsService } from '@spartan-ng/app/app/core/services/api-docs.service';
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HlmScrollArea, NgScrollbarModule, NgClass, PageNavLink],
	host: {
		class: 'hidden xl:block text-sm',
	},
	template: `
		<ng-template #pageNav>
			<ng-scrollbar hlm class="h-[calc(100vh-3.5rem)]">
				<div class="space-y-2 px-1">
					<h3 class="font-medium">On this page</h3>
					<ul class="m-0 flex list-none flex-col">
						@for (link of links(); track link.id) {
							<spartan-page-nav-link [ngClass]="{ 'pl-4': link.isNested }" [fragment]="link.id" [label]="link.label" />
						} @empty {
							@if (isDevMode()) {
								[DEV] Nothing to see here!
							}
						}
					</ul>
				</div>
			</ng-scrollbar>
		</ng-template>
	`,
})
export class PageNav implements OnInit, AfterViewInit, OnDestroy {
	public pageNavTpl = viewChild.required<TemplateRef<unknown>>('pageNav');

	private readonly _route = inject(ActivatedRoute);
	private readonly _routeData = toSignal(this._route.data);
	private readonly _apiDocsService = inject(ApiDocsService, { optional: true });

	protected readonly isDevMode = signal(isDevMode());

	protected readonly _links = signal<SamePageAnchorLink[]>([]);
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

	protected readonly links = computed(() =>
		this._dynamicLinks() && this._dynamicLinks().length ? this._dynamicLinks() : this._links(),
	);

	private readonly _platformId = inject(PLATFORM_ID);

	/**
	 * Reference to the tag with the main content of the page.
	 * For this to work, the component should be added immediately after a tag with the [spartanMainSection] directive.
	 */
	private readonly _page: HTMLElement = (inject(ElementRef).nativeElement as HTMLElement)
		.previousSibling as HTMLElement;

	ngOnInit() {
		if (isPlatformServer(this._platformId)) {
			if (isDevMode()) {
				console.error('This component should not be used for non-SSG/SPA pages.');
			}
			return;
		}

		const selectors = ['[spartanMainSection] spartan-section-sub-heading', '[spartanMainSection] > h3'];
		const headings = Array.from(this._page.querySelectorAll(selectors.join(',')));
		const links = headings.map((element) => {
			const { id, children, localName, textContent } = element;
			const isSubHeading = localName === 'spartan-section-sub-heading';
			const label = (isSubHeading ? children[0].childNodes[0].textContent : textContent) ?? '[DEV] Empty heading!';
			if (isDevMode() && id === '') {
				console.error(`[DEV] id missing for heading "${label}"`);
			}
			return { id, label, isNested: !isSubHeading };
		});

		this._links.set(links);
	}

	ngAfterViewInit(): void {
		if (!this.pageNavTpl()) return;
		pageNavTmpl.set(this.pageNavTpl());
	}

	ngOnDestroy(): void {
		pageNavTmpl.set(null);
	}
}
