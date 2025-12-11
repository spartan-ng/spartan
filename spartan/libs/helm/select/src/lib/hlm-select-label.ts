import { Directive, computed, inject, input } from '@angular/core';
import { BrnSelectLabel } from '@spartan-ng/brain/select';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmSelectContent } from './hlm-select-content';

@Directive({
	selector: '[hlmSelectLabel], hlm-select-label',
	hostDirectives: [BrnSelectLabel],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSelectLabel {
	private readonly _selectContent = inject(HlmSelectContent);
	private readonly _stickyLabels = computed(() => this._selectContent.stickyLabels());
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'text-muted-foreground px-2 py-1.5 text-xs',
			this._stickyLabels() ? 'bg-popover sticky top-0 z-[2] block' : '',
			this.userClass(),
		),
	);
}
