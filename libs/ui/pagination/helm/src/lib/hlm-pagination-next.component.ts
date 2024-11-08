import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { lucideChevronRight } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';
import { HlmPaginationLinkDirective } from './hlm-pagination-link.directive';

@Component({
	selector: 'hlm-pagination-next',
	standalone: true,
	imports: [HlmPaginationLinkDirective, HlmIconComponent],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<a
			[class]="_computedClass()"
			hlmPaginationLink
			[link]="link()"
			size="default"
			[attr.aria-label]="'Go to next page'"
		>
			<span>Next</span>
			<hlm-icon size="sm" name="lucideChevronRight" />
		</a>
	`,
})
export class HlmPaginationNextComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly link = input<RouterLink['routerLink']>();
	protected readonly _computedClass = computed(() => hlm('gap-1 pr-2.5', this.userClass()));
}
