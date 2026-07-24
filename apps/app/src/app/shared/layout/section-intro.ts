import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StyleOptionsDropdown } from '@spartan-ng/app/app/shared/page-options-dropdown/style-options-dropdown';
import { PageOptionsDropdown } from '../page-options-dropdown/page-options-dropdown';

@Component({
	selector: 'spartan-section-intro',
	imports: [PageOptionsDropdown, StyleOptionsDropdown],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col gap-4',
	},
	template: `
		<div class="flex items-center justify-between">
			<h1 class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">{{ name() }}</h1>

			<div class="flex items-center justify-between gap-2">
				@if (showThemeToggle()) {
					<spartan-style-options-dropdown />
				}
				<spartan-page-options-dropdown class="ms-auto hidden md:block" />
			</div>
		</div>
		<p class="text-muted-foreground text-[1.05rem] text-balance sm:text-base">{{ lead() }}</p>
	`,
})
export class SectionIntro {
	public readonly name = input('');
	public readonly lead = input('');
	public readonly showThemeToggle = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
}
