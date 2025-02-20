import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { ButtonVariants } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';
import { HlmPaginationLinkDirective } from './hlm-pagination-link.directive';

@Component({
	selector: 'hlm-pagination-next',
	imports: [HlmPaginationLinkDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<a
			[class]="_computedClass()"
			hlmPaginationLink
			[link]="link()"
			[queryParams]="queryParams()"
			[queryParamsHandling]="queryParamsHandling()"
			[size]="size()"
			[attr.aria-label]="ariaLabel()"
		>
			<span [class.sr-only]="iconOnly()">{{ text() }}</span>
			<ng-icon hlm size="sm" name="lucideChevronRight" />
		</a>
	`,
})
export class HlmPaginationNextComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly link = input<RouterLink['routerLink']>();
	public readonly queryParams = input<RouterLink['queryParams']>();
	public readonly queryParamsHandling = input<RouterLink['queryParamsHandling']>();

	public readonly ariaLabel = input<string>('Go to next page', { alias: 'aria-label' });
	public readonly text = input<string>('Next');
	public readonly iconOnly = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	protected readonly size = computed<ButtonVariants['size']>(() => (this.iconOnly() ? 'icon' : 'default'));

	protected readonly _computedClass = computed(() => hlm('gap-1', !this.iconOnly() ? 'pr-2.5' : '', this.userClass()));
}
