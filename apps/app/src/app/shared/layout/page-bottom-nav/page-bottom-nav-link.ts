import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-page-bottom-nav-link',
	imports: [RouterLink, HlmButton, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideArrowRight, lucideArrowLeft })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<a
			hlmBtn
			variant="secondary"
			[routerLink]="_routerLink()"
			size="sm"
			[relativeTo]="_isAbsolute() ? undefined : _activatedRoute"
		>
			@if (direction() === 'previous') {
				<ng-icon hlm size="sm" name="lucideArrowLeft" />
			}
			{{ label() }}
			@if (direction() === 'next') {
				<ng-icon hlm size="sm" name="lucideArrowRight" />
			}
		</a>
	`,
})
export class PageBottomNavLink {
	protected readonly _activatedRoute = inject(ActivatedRoute);

	public direction = input<'previous' | 'next'>('next');
	public href = input.required<string>();
	public label = input.required<string>();

	protected readonly _isAbsolute = computed(() => this.href().startsWith('/'));

	protected readonly _routerLink = computed(() => (this._isAbsolute() ? this.href() : ['..', this.href()]));
}
