import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { BrnSelectOption } from '@spartan-ng/brain/select';
import { HlmIcon } from '@spartan-ng/helm/icon';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-option',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnSelectOption, inputs: ['disabled', 'value'] }],
	providers: [provideIcons({ lucideCheck })],
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
	imports: [NgIcon, HlmIcon],
})
export class HlmSelectOption {
	protected readonly _brnSelectOption = inject(BrnSelectOption, { host: true });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'data-[active]:bg-accent data-[active]:text-accent-foreground [&>ng-icon]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>ng-icon]:pointer-events-none [&>ng-icon]:shrink-0 [&>ng-icon]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
			this.userClass(),
		),
	);
}
