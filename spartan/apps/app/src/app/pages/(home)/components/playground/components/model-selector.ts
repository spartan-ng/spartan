import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandEmpty } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { Model, ModelType } from '../data/models';

@Component({
	selector: 'spartan-model-selector',
	imports: [
		BrnPopoverImports,
		HlmPopoverImports,
		HlmCommandImports,
		NgIcon,
		HlmIcon,
		HlmButton,
		HlmLabel,
		BrnCommandEmpty,
	],
	providers: [provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'grid gap-3',
	},
	template: `
		<span hlmLabel>Model</span>
		<hlm-popover sideOffset="5">
			<button id="select-preset" variant="outline" hlmPopoverTrigger hlmBtn class="w-full flex-1 justify-between">
				{{ selectedModel() ? selectedModel()?.name : 'Load a model...' }}
				<ng-icon hlm name="lucideChevronsUpDown" size="sm" />
			</button>
			<div hlmPopoverContent class="w-full p-0" *brnPopoverContent="let ctx">
				<hlm-command>
					<hlm-command-search>
						<ng-icon hlm name="lucideSearch" size="sm" />
						<input type="text" hlm-command-search-input placeholder="Search Models" />
					</hlm-command-search>

					<hlm-command-list>
						@for (type of types(); track type) {
							<hlm-command-group>
								<hlm-command-group-label>{{ type }}</hlm-command-group-label>
								@for (model of getModelsByType(type); track model.id) {
									<button hlm-command-item [value]="model.id" (click)="selectedModel.set(model); ctx.close()">
										{{ model.name }}
										<ng-icon
											hlm
											name="lucideCheck"
											size="sm"
											class="ml-auto"
											[class]="{
												'opacity-0': selectedModel()?.id !== model.id,
												'opacity-100': selectedModel()?.id === model.id,
											}"
										/>
									</button>
								}
							</hlm-command-group>
						}
					</hlm-command-list>
					<!-- Empty state -->
					<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
				</hlm-command>
			</div>
		</hlm-popover>
	`,
})
export class ModelSelector {
	public readonly models = input.required<Model[]>();
	public readonly types = input.required<ModelType[]>();
	public readonly selectedModel = signal<Model | null>(null);

	public getModelsByType(type: ModelType): Model[] {
		return this.models().filter((model) => model.type === type);
	}
}
