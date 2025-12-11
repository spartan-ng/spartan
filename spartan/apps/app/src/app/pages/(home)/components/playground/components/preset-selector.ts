import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandEmpty } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { Preset } from '../data/presets';

@Component({
	selector: 'spartan-preset-selector',
	imports: [BrnPopoverImports, HlmPopoverImports, HlmCommandImports, NgIcon, HlmIcon, HlmButton, BrnCommandEmpty],
	providers: [provideIcons({ lucideSearch, lucideCheck, lucideChevronsUpDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover sideOffset="5">
			<button
				id="select-preset"
				hlmPopoverTrigger
				hlmBtn
				variant="outline"
				class="w-[300px] flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
			>
				{{ selectedPreset() ? selectedPreset()?.name : 'Load a preset...' }}
				<ng-icon hlm name="lucideChevronsUpDown" size="sm" />
			</button>
			<div hlmPopoverContent class="w-[300px] p-0" *brnPopoverContent="let ctx">
				<hlm-command>
					<hlm-command-search>
						<ng-icon hlm name="lucideSearch" size="sm" />
						<input type="text" hlm-command-search-input placeholder="Search Presets" />
					</hlm-command-search>

					<hlm-command-list>
						<hlm-command-group>
							<hlm-command-group-label>Examples</hlm-command-group-label>

							@for (preset of presets(); track preset.id) {
								<button hlm-command-item [value]="preset.id" (click)="selectedPreset.set(preset); ctx.close()">
									{{ preset.name }}
									<ng-icon
										hlm
										name="lucideCheck"
										size="sm"
										class="ml-auto"
										[class]="{
											'opacity-0': selectedPreset()?.id !== preset.id,
											'opacity-100': selectedPreset()?.id === preset.id,
										}"
									/>
								</button>
							}
						</hlm-command-group>

						<hlm-command-separator />
					</hlm-command-list>

					<!-- Empty state -->
					<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
				</hlm-command>
			</div>
		</hlm-popover>
	`,
})
export class PresetSelector {
	public readonly presets = input.required<Preset[]>();
	public readonly selectedPreset = signal<Preset | undefined>(undefined);
}
