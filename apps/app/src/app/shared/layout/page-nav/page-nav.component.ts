import { NgClass, isPlatformServer } from '@angular/common';
import {
	type AfterViewInit,
	Component,
	ElementRef,
	type OnDestroy,
	type OnInit,
	PLATFORM_ID,
	type TemplateRef,
	ViewChild,
	inject,
	isDevMode,
	signal,
} from '@angular/core';
import { HlmScrollAreaDirective } from '@spartan-ng/ui-scrollarea-helm';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PageNavLinkComponent } from './page-nav-link.component';
import { pageNavTmpl } from './page-nav-outlet.component';

type SamePageAnchorLink = {
	id: string;
	label: string;
	isNested: boolean;
};

@Component({
	selector: 'spartan-page-nav',
	imports: [HlmScrollAreaDirective, NgScrollbarModule, NgClass, PageNavLinkComponent],
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
export class PageNavComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('pageNav', { static: true })
	public pageNavTpl?: TemplateRef<unknown>;

	protected readonly isDevMode = signal(isDevMode());
	protected readonly links = signal<SamePageAnchorLink[]>([]);

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
		this.links.set(links);
	}
	ngAfterViewInit() {
		if (!this.pageNavTpl) return;
		pageNavTmpl.set(this.pageNavTpl);
	}
	ngOnDestroy() {
		pageNavTmpl.set(null);
	}
}
