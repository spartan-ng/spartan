import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { BrnSelectOption } from '@spartan-ng/brain/select';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-option',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnSelectOption, inputs: ['disabled', 'value'] }],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<span class="absolute right-2 flex size-3.5 items-center justify-center">
			@if (this._brnSelectOption.selected()) {
				<ng-icon hlm size="sm" aria-hidden="true" name="lucideCheck" />
			}
		</span>

		<ng-content />
	`,
})
export class HlmSelectOption {
	protected readonly _brnSelectOption = inject(BrnSelectOption, { host: true });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			`data-[active]:bg-accent data-[active]:text-accent-foreground [&>ng-icon:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 [&>ng-icon]:pointer-events-none [&>ng-icon]:size-4 [&>ng-icon]:shrink-0`,
			this.userClass(),
		),
	);
}
