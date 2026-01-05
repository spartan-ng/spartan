import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { BrnSelectOption } from '@spartan-ng/brain/select';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-option',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnSelectOption, inputs: ['disabled', 'value'] }],
	template: `
		<span class="absolute end-2 flex size-3.5 items-center justify-center">
			@if (this._brnSelectOption.selected()) {
				<ng-icon hlm size="sm" aria-hidden="true" name="lucideCheck" />
			}
		</span>

		<ng-content />
	`,
})
export class HlmSelectOption {
	protected readonly _brnSelectOption = inject(BrnSelectOption, { host: true });
	constructor() {
		classes(
			() =>
				`data-[active]:bg-accent data-[active]:text-accent-foreground [&>ng-icon:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 [&>ng-icon]:pointer-events-none [&>ng-icon]:size-4 [&>ng-icon]:shrink-0`,
		);
	}
}
