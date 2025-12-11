import { Directive, computed, input } from '@angular/core';
import { BrnLabel } from '@spartan-ng/brain/label';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmLabel]',
	hostDirectives: [
		{
			directive: BrnLabel,
			inputs: ['id'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmLabel {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-50 has-[[disabled]]:cursor-not-allowed has-[[disabled]]:opacity-50',
			this.userClass(),
		),
	);
}
