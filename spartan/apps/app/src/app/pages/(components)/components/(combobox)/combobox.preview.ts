import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

type Framework = { label: string; value: string };

@Component({
	selector: 'spartan-combobox-preview',
	imports: [
		BrnCommandImports,
		HlmCommandImports,
		NgIcon,
		HlmIconImports,
		HlmButtonImports,
		BrnPopoverImports,
		HlmPopoverImports,
	],
	providers: [provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck })],
	template: `
		<hlm-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5">
			<button
				class="w-[200px] justify-between"
				id="edit-profile"
				hlmPopoverTrigger
				(click)="state.set('open')"
				hlmBtn
				variant="outline"
			>
				{{ currentFramework() ? currentFramework()?.label : 'Select framework...' }}
				<ng-icon hlm size="sm" name="lucideChevronsUpDown" class="opacity-50" />
			</button>
			<hlm-command *brnPopoverContent="let ctx" hlmPopoverContent class="w-[200px] p-0">
				<hlm-command-search>
					<ng-icon hlm name="lucideSearch" />
					<input placeholder="Search framework..." hlm-command-search-input />
				</hlm-command-search>
				<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
				<hlm-command-list>
					<hlm-command-group>
						@for (framework of frameworks; track framework) {
							<button hlm-command-item [value]="framework.value" (selected)="commandSelected(framework)">
								<span>{{ framework.label }}</span>
								<ng-icon
									hlm
									class="ml-auto"
									[class.opacity-0]="currentFramework()?.value !== framework.value"
									name="lucideCheck"
									hlmCommandIcon
								/>
							</button>
						}
					</hlm-command-group>
				</hlm-command-list>
			</hlm-command>
		</hlm-popover>
	`,
})
export class ComboboxPreview {
	public frameworks = [
		{
			label: 'AnalogJs',
			value: 'analogjs',
		},
		{
			label: 'Angular',
			value: 'angular',
		},
		{
			label: 'Vue',
			value: 'vue',
		},
		{
			label: 'Nuxt',
			value: 'nuxt',
		},
		{
			label: 'React',
			value: 'react',
		},
		{
			label: 'NextJs',
			value: 'nextjs',
		},
	];
	public readonly currentFramework = signal<Framework | undefined>(undefined);
	public readonly state = signal<'closed' | 'open'>('closed');

	stateChanged(state: 'open' | 'closed') {
		this.state.set(state);
	}

	commandSelected(framework: Framework) {
		this.state.set('closed');
		if (this.currentFramework()?.value === framework.value) {
			this.currentFramework.set(undefined);
		} else {
			this.currentFramework.set(framework);
		}
	}
}
