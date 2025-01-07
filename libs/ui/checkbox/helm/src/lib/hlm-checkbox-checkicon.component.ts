import { Component, computed, inject, input } from '@angular/core';
import { lucideCheck } from '@ng-icons/lucide';
import { BrnCheckboxComponent } from '@spartan-ng/brain/checkbox';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-checkbox-checkicon',
	standalone: true,
	imports: [HlmIconComponent],
	providers: [provideIcons({ lucideCheck })],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<hlm-icon size="sm" [name]="iconName()" />
	`,
})
export class HlmCheckboxCheckIconComponent {
	private readonly _brnCheckbox = inject(BrnCheckboxComponent);
	protected _checked = this._brnCheckbox?.isChecked;
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	public readonly iconName = input<string>('lucideCheck');

	protected _computedClass = computed(() =>
		hlm(
			'h-4 w-4 leading-none group-data-[state=unchecked]:opacity-0',
			this._checked() === 'indeterminate' ? 'opacity-50' : '',
			this.userClass(),
		),
	);
}
