import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import * as lucide from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<{}> = {
	title: 'Combobox',
	decorators: [
		moduleMetadata({
			providers: [provideIcons(lucide)],
			imports: [BrnCommandImports, HlmCommandImports, HlmIconImports, HlmButtonImports],
		}),
	],
};

export default meta;
type Story = StoryObj<{}>;
type Framework = { label: string; value: string };

const frameworks: Framework[] = [
	{ label: 'AnalogJs', value: 'analogjs' },
	{ label: 'Angular', value: 'angular' },
	{ label: 'Vue', value: 'vue' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'React', value: 'react' },
	{ label: 'NextJs', value: 'nextjs' },
	{ label: 'Svelte', value: 'svelte' },
	{ label: 'Astro', value: 'astro' },
	{ label: 'Ember', value: 'ember' },
	{ label: 'Backbone', value: 'backbone' },
	{ label: 'Lit', value: 'lit' },
	{ label: 'Preact', value: 'preact' },
	{ label: 'SolidJS', value: 'solidjs' },
	{ label: 'Remix', value: 'remix' },
	{ label: 'Gatsby', value: 'gatsby' },
	{ label: 'Qwik', value: 'qwik' },
	{ label: 'Blazor', value: 'blazor' },
	{ label: 'Flutter Web', value: 'flutter-web' },
	{ label: 'Ionic Angular', value: 'ionic-angular' },
];

@Component({
	selector: 'combobox-component',
	imports: [
		BrnCommandImports,
		HlmCommandImports,
		BrnPopoverImports,
		HlmPopoverImports,
		HlmIconImports,
		HlmButtonImports,
	],
	template: `
		<hlm-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5">
			<button
				class="w-[200px] justify-between"
				id="edit-profile"
				variant="outline"
				hlmPopoverTrigger
				(click)="state.set('open')"
				hlmBtn
			>
				{{ currentFramework()?.label ?? 'Select framework...' }}
				<ng-icon hlm size="sm" name="lucideChevronsUpDown" />
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
								<ng-icon
									hlm
									[class.opacity-0]="currentFramework()?.value !== framework.value"
									name="lucideCheck"
									hlmCommandIcon
								/>
								{{ framework.label }}
							</button>
						}
					</hlm-command-group>
				</hlm-command-list>
			</hlm-command>
		</hlm-popover>
	`,
})
class Combobox {
	public readonly frameworks = frameworks;
	public currentFramework = signal<Framework | undefined>(undefined);
	public state = signal<'closed' | 'open'>('closed');

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

@Component({
	selector: 'combobox-field-story',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		HlmFieldImports,
		BrnCommandImports,
		HlmCommandImports,
		BrnPopoverImports,
		HlmPopoverImports,
		HlmIconImports,
		HlmButtonImports,
	],
	template: `
		<form [formGroup]="form">
			<div hlmField [attr.data-invalid]="showError ? 'true' : null">
				<label hlmFieldLabel>Framework *</label>
				<hlm-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5">
					<button
						class="w-[200px] justify-between"
						id="edit-profile"
						variant="outline"
						hlmPopoverTrigger
						(click)="state.set('open')"
						hlmBtn
						hlmFieldControlDescribedBy
					>
						{{ currentFramework()?.label ?? 'Select framework...' }}
						<ng-icon hlm size="sm" name="lucideChevronsUpDown" />
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
										<ng-icon
											hlm
											[class.opacity-0]="currentFramework()?.value !== framework.value"
											name="lucideCheck"
											hlmCommandIcon
										/>
										{{ framework.label }}
									</button>
								}
							</hlm-command-group>
						</hlm-command-list>
					</hlm-command>
				</hlm-popover>
				<p hlmFieldDescription>Pick the framework you rely on most.</p>
				@if (showError) {
					<hlm-field-error>Choose a framework to continue.</hlm-field-error>
				}

				<div class="mt-3 flex flex-wrap items-center gap-2">
					<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
					<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
				</div>
			</div>
		</form>
	`,
})
export class ComboboxFieldStory {
	public readonly form = new FormGroup({
		framework: new FormControl('', { validators: [Validators.required] }),
	});

	public readonly frameworks = frameworks;
	public currentFramework = signal<Framework | undefined>(undefined);
	public state = signal<'closed' | 'open'>('closed');

	public get showError() {
		const control = this.form.get('framework');
		return !!control && control.invalid && (control.touched || control.dirty);
	}

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
		this.form.get('framework')?.setValue(framework.value);
	}
}

export const Default: Story = {
	decorators: [
		moduleMetadata({
			imports: [Combobox],
		}),
	],
	render: () => ({
		template: '<combobox-component/>',
	}),
};

export const WithHintAndError: Story = {
	decorators: [
		moduleMetadata({
			providers: [provideIcons(lucide)],
			imports: [ComboboxFieldStory],
		}),
	],
	render: () => ({
		template: '<combobox-field-story/>',
	}),
};
