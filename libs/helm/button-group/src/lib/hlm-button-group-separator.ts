import { Component, input } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-button-group-separator',
	imports: [HlmSeparator],
	template: `
		<hlm-separator
			[class]="_computedClass()"
			[orientation]="orientation()"
			[decorative]="decorative()"
			[attr.data-slot]="'separator'"
		/>
	`,
})
export class HlmButtonGroupSeparator {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly orientation = input<'horizontal' | 'vertical'>('vertical');
	public readonly decorative = input<boolean>();

	protected readonly _computedClass = () =>
		hlm(
			'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px',
			this.userClass(),
		);
}
