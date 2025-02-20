import { NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-page-bottom-nav-link',
	imports: [RouterLink, NgIf, HlmButtonDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
	template: `
		<a hlmBtn variant="outline" [routerLink]="routerLink" [relativeTo]="isAbsolute ? undefined : activatedRoute">
			<ng-icon hlm size="sm" class="mr-2" name="lucideChevronLeft" *ngIf="direction === 'previous'" />
			{{ label }}
			<ng-icon hlm size="sm" class="ml-2" name="lucideChevronRight" *ngIf="direction === 'next'" />
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
