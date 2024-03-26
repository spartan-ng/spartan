import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { Meta, StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { BrnSelectImports } from './brain/src';
import { HlmSelectImports } from './helm/src';

interface BrnSelectStoryArgs {
	initialValue: string;
	disabled: boolean;
	placeholder: string;
	multiple: boolean;
	dir: 'ltr' | 'rtl';
}

const meta: Meta<BrnSelectStoryArgs> = {
	title: 'Select',
	args: {
		disabled: false,
		placeholder: 'Select an option',
		multiple: false,
		initialValue: '',
		dir: 'ltr',
	},
	argTypes: {
		dir: { control: 'radio', options: ['ltr', 'rtl'] },
	},
	decorators: [
		moduleMetadata({
			imports: [CommonModule, FormsModule, ReactiveFormsModule, BrnSelectImports, HlmSelectImports, HlmLabelDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnSelectStoryArgs>;

export const Default: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-select class="inline-block" ${argsToTemplate(args, { exclude: ['initialValue'] })}>
				<hlm-select-trigger class="w-56">
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content>
					<hlm-select-label>Fruits</hlm-select-label>
					<hlm-option value="apple">Apple</hlm-option>
					<hlm-option value="banana">Banana</hlm-option>
					<hlm-option value="blueberry">Blueberry</hlm-option>
					<hlm-option value="grapes">Grapes</hlm-option>
					<hlm-option value="pineapple">Pineapple</hlm-option>
				</hlm-select-content>
			</hlm-select>
		`,
	}),
};

export const ReactiveFormControl: Story = {
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl() }) },
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.valueChanges | async | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<brn-select class="w-56" ${argsToTemplate(args, { exclude: ['initialValue'] })} formControlName="fruit">
					<hlm-select-trigger>
						<brn-select-value hlm />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-option value="apple">Apple</hlm-option>
						<hlm-option value="banana">Banana</hlm-option>
						<hlm-option value="blueberry">Blueberry</hlm-option>
						<hlm-option value="grapes">Grapes</hlm-option>
						<hlm-option value="pineapple">Pineapple</hlm-option>
						<hlm-option>Clear</hlm-option>
					</hlm-select-content>
				</brn-select>
				<form></form>
			</form>
		`,
	}),
};

export const ReactiveFormControlWithValidation: Story = {
	render: (args) => ({
		props: {
			...args,
			fruitGroup: new FormGroup({
				fruit: new FormControl(args.initialValue || null, { validators: Validators.required }),
			}),
		},
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.valueChanges | async | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<brn-select class="w-56" formControlName="fruit" ${argsToTemplate(args, { exclude: ['initialValue'] })}>
					<hlm-select-trigger>
						<brn-select-value hlm />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-option value="apple">Apple</hlm-option>
						<hlm-option value="banana">Banana</hlm-option>
						<hlm-option value="blueberry">Blueberry</hlm-option>
						<hlm-option value="grapes">Grapes</hlm-option>
						<hlm-option value="pineapple">Pineapple</hlm-option>
						<hlm-option>Clear</hlm-option>
					</hlm-select-content>
				</brn-select>
				@if (fruitGroup.controls.fruit.invalid && fruitGroup.controls.fruit.touched){
				<span class="text-destructive">Required</span>
				}
			</form>
		`,
	}),
};

export const ReactiveFormControlWithValidationWithLabel: Story = {
	render: (args) => ({
		props: {
			...args,
			fruitGroup: new FormGroup({
				fruit: new FormControl(args.initialValue || null, { validators: Validators.required }),
			}),
		},
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.valueChanges | async | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<hlm-select class="w-56" formControlName="fruit" ${argsToTemplate(args, { exclude: ['initialValue'] })}>
					<label hlmLabel>Select a Fruit</label>
					<hlm-select-trigger>
						<brn-select-value hlm />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-option value="apple">Apple</hlm-option>
						<hlm-option value="banana">Banana</hlm-option>
						<hlm-option value="blueberry">Blueberry</hlm-option>
						<hlm-option value="grapes">Grapes</hlm-option>
						<hlm-option value="pineapple">Pineapple</hlm-option>
						<hlm-option>Clear</hlm-option>
					</hlm-select-content>
				</hlm-select>
				@if (fruitGroup.controls.fruit.invalid && fruitGroup.controls.fruit.touched){
				<span class="text-destructive">Required</span>
				}
			</form>
		`,
	}),
};

export const NgModelFormControl: Story = {
	render: (args) => ({
		props: {
			...args,
			fruit: signal(args.initialValue),
		},
		template: /* HTML */ `
			<form ngForm>
				<div class="mb-3">
					<pre>Form Control Value: {{fruit() | json }}</pre>
				</div>
				<hlm-select
					class="w-56"
					${argsToTemplate(args, { exclude: ['initialValue'] })}
					[(ngModel)]="fruit"
					name="fruit"
				>
					<label hlmLabel>Select a Fruit</label>
					<hlm-select-trigger>
						<brn-select-value hlm />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-option value="apple">Apple</hlm-option>
						<hlm-option value="banana">Banana</hlm-option>
						<hlm-option value="blueberry">Blueberry</hlm-option>
						<hlm-option value="grapes">Grapes</hlm-option>
						<hlm-option value="pineapple">Pineapple</hlm-option>
					</hlm-select-content>
				</hlm-select>
			</form>
		`,
	}),
};

export const SelectWithLabel: Story = {
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl() }) },
		template: /* HTML */ `
			<form [formGroup]="fruitGroup">
				<hlm-select formControlName="fruit" ${argsToTemplate(args, { exclude: ['initialValue'] })}>
					<label hlmLabel>Select a Fruit</label>
					<hlm-select-trigger class="w-56">
						<brn-select-value />
					</hlm-select-trigger>
					<hlm-select-content class="w-56">
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-option value="apple">Apple</hlm-option>
						<hlm-option value="banana">Banana</hlm-option>
						<hlm-option value="blueberry">Blueberry</hlm-option>
						<hlm-option value="grapes">Grapes</hlm-option>
						<hlm-option value="pineapple">Pineapple</hlm-option>
					</hlm-select-content>
				</hlm-select>
				<form></form>
			</form>
		`,
	}),
};

export const Scrollable: Story = {
	render: (args) => ({
		props: { ...args, myform: new FormGroup({ timezone: new FormControl() }) },
		template: /* HTML */ `
			<form [formGroup]="myform">
				<hlm-select formControlName="timezone" ${argsToTemplate(args, { exclude: ['initialValue'] })}>
					<hlm-select-trigger class="w-[280px]">
						<hlm-select-value />
					</hlm-select-trigger>
					<hlm-select-content class="min-w-content max-h-96">
						<hlm-select-scroll-up />

						<hlm-select-group>
							<hlm-select-label>North America</hlm-select-label>
							<hlm-option value="est">Eastern Standard Time (EST)</hlm-option>
							<hlm-option value="cst">Central Standard Time (CST)</hlm-option>
							<hlm-option value="mst">Mountain Standard Time (MST)</hlm-option>
							<hlm-option value="pst">Pacific Standard Time (PST)</hlm-option>
							<hlm-option value="akst">Alaska Standard Time (AKST)</hlm-option>
							<hlm-option value="hst">Hawaii Standard Time (HST)</hlm-option>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>Europe & Africa</hlm-select-label>
							<hlm-option value="gmt">Greenwich Mean Time (GMT)</hlm-option>
							<hlm-option value="cet">Central European Time (CET)</hlm-option>
							<hlm-option value="eet">Eastern European Time (EET)</hlm-option>
							<hlm-option value="west">Western European Summer Time (WEST)</hlm-option>
							<hlm-option value="cat">Central Africa Time (CAT)</hlm-option>
							<hlm-option value="eat">East Africa Time (EAT)</hlm-option>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>Asia</hlm-select-label>
							<hlm-option value="msk">Moscow Time (MSK)</hlm-option>
							<hlm-option value="ist">India Standard Time (IST)</hlm-option>
							<hlm-option value="cst_china">China Standard Time (CST)</hlm-option>
							<hlm-option value="jst">Japan Standard Time (JST)</hlm-option>
							<hlm-option value="kst">Korea Standard Time (KST)</hlm-option>
							<hlm-option value="ist_indonesia">Indonesia Central Standard Time (WITA)</hlm-option>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>Australia & Pacific</hlm-select-label>
							<hlm-option value="awst">Australian Western Standard Time (AWST)</hlm-option>
							<hlm-option value="acst">Australian Central Standard Time (ACST)</hlm-option>
							<hlm-option value="aest">Australian Eastern Standard Time (AEST)</hlm-option>
							<hlm-option value="nzst">New Zealand Standard Time (NZST)</hlm-option>
							<hlm-option value="fjt">Fiji Time (FJT)</hlm-option>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>South America</hlm-select-label>
							<hlm-option value="art">Argentina Time (ART)</hlm-option>
							<hlm-option value="bot">Bolivia Time (BOT)</hlm-option>
							<hlm-option value="brt">Brasilia Time (BRT)</hlm-option>
							<hlm-option value="clt">Chile Standard Time (CLT)</hlm-option>
						</hlm-select-group>

						<hlm-select-scroll-down />
					</hlm-select-content>
				</hlm-select>
				<form></form>
			</form>
		`,
	}),
};

export const ScrollableWithStickyLabels: Story = {
	render: (args) => ({
		props: { ...args, myform: new FormGroup({ timezone: new FormControl() }) },
		template: /* HTML */ `
			<form [formGroup]="myform">
				<hlm-select formControlName="timezone" ${argsToTemplate(args, { exclude: ['initialValue'] })}>
					<hlm-select-trigger class="w-[280px]">
						<hlm-select-value />
					</hlm-select-trigger>
					<hlm-select-content class="max-h-96" [stickyLabels]="true">
						<hlm-select-scroll-up />

						<hlm-select-group>
							<hlm-select-label>North America</hlm-select-label>
							<hlm-option value="est">Eastern Standard Time (EST)</hlm-option>
							<hlm-option value="cst">Central Standard Time (CST)</hlm-option>
							<hlm-option value="mst">Mountain Standard Time (MST)</hlm-option>
							<hlm-option value="pst">Pacific Standard Time (PST)</hlm-option>
							<hlm-option value="akst">Alaska Standard Time (AKST)</hlm-option>
							<hlm-option value="hst">Hawaii Standard Time (HST)</hlm-option>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>Europe & Africa</hlm-select-label>
							<hlm-option value="gmt">Greenwich Mean Time (GMT)</hlm-option>
							<hlm-option value="cet">Central European Time (CET)</hlm-option>
							<hlm-option value="eet">Eastern European Time (EET)</hlm-option>
							<hlm-option value="west">Western European Summer Time (WEST)</hlm-option>
							<hlm-option value="cat">Central Africa Time (CAT)</hlm-option>
							<hlm-option value="eat">East Africa Time (EAT)</hlm-option>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>Asia</hlm-select-label>
							<hlm-option value="msk">Moscow Time (MSK)</hlm-option>
							<hlm-option value="ist">India Standard Time (IST)</hlm-option>
							<hlm-option value="cst_china">China Standard Time (CST)</hlm-option>
							<hlm-option value="jst">Japan Standard Time (JST)</hlm-option>
							<hlm-option value="kst">Korea Standard Time (KST)</hlm-option>
							<hlm-option value="ist_indonesia">Indonesia Central Standard Time (WITA)</hlm-option>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>Australia & Pacific</hlm-select-label>
							<hlm-option value="awst">Australian Western Standard Time (AWST)</hlm-option>
							<hlm-option value="acst">Australian Central Standard Time (ACST)</hlm-option>
							<hlm-option value="aest">Australian Eastern Standard Time (AEST)</hlm-option>
							<hlm-option value="nzst">New Zealand Standard Time (NZST)</hlm-option>
							<hlm-option value="fjt">Fiji Time (FJT)</hlm-option>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>South America</hlm-select-label>
							<hlm-option value="art">Argentina Time (ART)</hlm-option>
							<hlm-option value="bot">Bolivia Time (BOT)</hlm-option>
							<hlm-option value="brt">Brasilia Time (BRT)</hlm-option>
							<hlm-option value="clt">Chile Standard Time (CLT)</hlm-option>
						</hlm-select-group>

						<hlm-select-scroll-down />
					</hlm-select-content>
				</hlm-select>
				<form></form>
			</form>
		`,
	}),
};
