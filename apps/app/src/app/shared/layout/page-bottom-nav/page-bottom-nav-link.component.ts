import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-page-bottom-nav-link',
	imports: [RouterLink, HlmButtonDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideArrowRight, lucideArrowLeft })],
	template: `
		<a
			hlmBtn
			variant="secondary"
			[routerLink]="routerLink"
			size="sm"
			[relativeTo]="isAbsolute ? undefined : activatedRoute"
		>
			@if (direction === 'previous') {
				<ng-icon hlm size="sm" name="lucideArrowLeft" />
			}
			{{ label }}
			@if (direction === 'next') {
				<ng-icon hlm size="sm" name="lucideArrowRight" />
			}
		</a>
	`,
})
export class PageBottomNavLinkComponent {
	protected activatedRoute = inject(ActivatedRoute);
	@Input()
	public direction: 'previous' | 'next' = 'next';
	@Input()
	public href = '';
	@Input()
	public label = '';

	protected get isAbsolute() {
		return this.href.startsWith('/');
	}
	protected get routerLink() {
		return this.isAbsolute ? this.href : ['..', this.href];
	}
}
