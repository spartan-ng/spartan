import { computed, Directive, input } from '@angular/core';
import { BrnNavigationMenu } from '@spartan-ng/brain/navigation-menu';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'nav[hlmNavigationMenu]',
	hostDirectives: [
		{
			directive: BrnNavigationMenu,
			inputs: ['value', 'delayDuration', 'skipDelayDuration', 'dir', 'orientation'],
			outputs: ['valueChange'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmNavigationMenu {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', this.userClass()),
	);
}
