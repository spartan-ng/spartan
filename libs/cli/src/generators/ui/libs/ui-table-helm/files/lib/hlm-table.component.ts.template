import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-table',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		role: 'table',
		'[attr.aria-labelledby]': 'labeledBy()',
	},
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmTableComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex flex-col text-sm [&_hlm-trow:last-child]:border-0', this.userClass()),
	);

	// we aria-labelledby to be settable from outside but use the input by default.
	public readonly _labeledByInput = input<string | null | undefined>(undefined, { alias: 'aria-labelledby' });
	public readonly labeledBy = signal<string | null | undefined>(undefined);

	constructor() {
		effect(() => this.labeledBy.set(this._labeledByInput()), { allowSignalWrites: true });
	}
}
