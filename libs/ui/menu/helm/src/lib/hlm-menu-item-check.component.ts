import { Component, computed, input } from '@angular/core';
import { lucideCheck } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-item-check',
	standalone: true,
	providers: [provideIcons({ lucideCheck })],
	imports: [HlmIconComponent],
	template: `
		<!-- Using 1rem for size to mimick h-4 w-4 -->
		<hlm-icon size="1rem" name="lucideCheck" />
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuItemCheckComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'group-[.checked]:opacity-100 opacity-0 absolute left-2 flex h-3.5 w-3.5 items-center justify-center',
			this.userClass(),
		),
	);
}
