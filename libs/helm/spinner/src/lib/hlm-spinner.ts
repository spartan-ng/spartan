import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-spinner',
	imports: [NgIcon],
	providers: [provideIcons({ lucideLoader })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		role: 'status',
		'[attr.aria-label]': 'ariaLabel()',
		class: 'inline-flex',
	},
	template: `
		<ng-icon [name]="icon()" [class]="_computedClass()" />
	`,
})
export class HlmSpinner {
	/**
	 * The name of the icon to be used as the spinner.
	 * Use provideIcons({ ... }) to register custom icons.
	 */
	public readonly icon = input<string>('lucideLoader');

	/** Aria label for the spinner for accessibility. */
	public readonly ariaLabel = input<string>('Loading', { alias: 'aria-label' });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('text-base motion-safe:animate-spin', this.userClass()));
}
