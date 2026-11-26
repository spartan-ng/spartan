import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { buttonVariants } from '@spartan-ng/helm/button';
import { classes, hlm } from '@spartan-ng/helm/utils';
import { injectHlmPaginationConfig } from './hlm-pagination.token';

@Component({
	selector: 'a[hlm-pagination-next],a[hlmPaginationNext]',
	exportAs: 'hlmPaginationNext',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: RouterLink,
			inputs: [
				'routerLink: link',
				'target',
				'queryParams',
				'fragment',
				'queryParamsHandling',
				'state',
				'info',
				'relativeTo',
				'preserveFragment',
				'skipLocationChange',
				'replaceUrl',
			],
		},
	],
	host: {
		'data-slot': 'pagination-link',
		'[attr.aria-label]': 'ariaLabel()',
	},
	template: `
		<span [class]="_labelClass()">{{ text() }}</span>
		<ng-icon name="lucideChevronRight" class="spartan-rtl-flip" />
	`,
})
export class HlmPaginationNext {
	private readonly _config = injectHlmPaginationConfig();

	/** The aria-label for the next page link. */
	public readonly ariaLabel = input<string>(this._config.nextAriaLabel, { alias: 'aria-label' });
	/** The text to display for the next page link. */
	public readonly text = input<string>(this._config.nextLabel);
	/** Whether the button should only display the icon. */
	public readonly iconOnly = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});
	/** The link to navigate to the page. */
	public readonly link = input<RouterLink['routerLink']>();
	protected readonly _labelClass = computed(() => hlm(this.iconOnly() ? 'sr-only' : 'hidden sm:block'));

	constructor() {
		classes(() => [
			'spartan-pagination-link relative',
			buttonVariants({ variant: 'ghost', size: this.iconOnly() ? 'icon' : 'default' }),
			this.link() === undefined && 'cursor-pointer',
			!this.iconOnly() && 'spartan-pagination-next',
		]);
	}
}
