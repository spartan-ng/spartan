import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewEncapsulation,
	computed,
	contentChild,
	input,
	signal,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { BrnSelectImports, BrnSelectTriggerDirective } from '@spartan-ng/brain/select';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import type { ClassValue } from 'clsx';
import { HlmIconDirective } from '../icon/helm/src';
import { HlmSelectImports } from './helm/src';

interface BrnSelectStoryArgs {
	initialValue: string | string[];
	disabled: boolean;
	placeholder: string;
	multiple: boolean;
	dir: 'ltr' | 'rtl';
	selectValueTransformFn: (values: (string | undefined)[]) => string;
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
		selectValueTransformFn: { type: 'function', control: false },
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
			<hlm-select class="inline-block" ${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}>
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
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl(args.initialValue) }) },
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.value | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<brn-select
					class="w-56"
					${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}
					formControlName="fruit"
				>
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
			</form>
		`,
	}),
};

export const DisabledOption: Story = {
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl(args.initialValue) }) },
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.value | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<brn-select
					class="w-56"
					${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}
					formControlName="fruit"
				>
					<hlm-select-trigger>
						<brn-select-value hlm />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-option value="apple">Apple</hlm-option>
						<hlm-option data-testid="banana-option" value="banana" disabled>Banana</hlm-option>
						<hlm-option value="blueberry">Blueberry</hlm-option>
						<hlm-option value="grapes">Grapes</hlm-option>
						<hlm-option value="pineapple">Pineapple</hlm-option>
						<hlm-option>Clear</hlm-option>
					</hlm-select-content>
				</brn-select>
			</form>
		`,
	}),
};

export const SelectValueTransformFn: Story = {
	render: (args) => ({
		props: {
			...args,
			fruitGroup: new FormGroup({ fruit: new FormControl(args.initialValue) }),
			selectValueTransformFn: (values: (string | undefined)[]) => {
				return values.join(' | ');
			},
			multiple: true,
		},
		template: /* HTML */ `
			<div class="mb-3" (onClick)="console.log('CLICKED')">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.value | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<brn-select
					class="w-56"
					${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}
					formControlName="fruit"
				>
					<hlm-select-trigger>
						<brn-select-value hlm [transformFn]="selectValueTransformFn" />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-option value="apple">Apple</hlm-option>
						<hlm-option data-testid="banana-option" value="banana" disabled>Banana</hlm-option>
						<hlm-option value="blueberry">Blueberry</hlm-option>
						<hlm-option value="grapes">Grapes</hlm-option>
						<hlm-option value="pineapple">Pineapple</hlm-option>
						<hlm-option>Clear</hlm-option>
					</hlm-select-content>
				</brn-select>
			</form>
		`,
	}),
};

export const ReactiveFormControlWithForAndInitialValue: Story = {
	render: (args) => ({
		args: {
			initialValue: 'apple',
		},
		props: {
			...args,
			fruitGroup: new FormGroup({
				fruit: new FormControl(args.initialValue || null, { validators: Validators.required }),
			}),
			options: [
				{ value: 'apple', label: 'Apple' },
				{ value: 'banana', label: 'Banana' },
				{ value: 'blueberry', label: 'Blueberry' },
				{ value: 'grapes', label: 'Grapes' },
				{ value: 'pineapple', label: 'Pineapple' },
			],
		},
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.value | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<brn-select
					class="w-56"
					${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}
					formControlName="fruit"
				>
					<hlm-select-trigger>
						<brn-select-value hlm />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						@for(option of options; track option.value){
						<hlm-option [value]="option.value">{{option.label}}</hlm-option>
						}
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

const appleAndBlueberry = new FormGroup({
	fruit: new FormControl(['apple', 'blueberry'], { validators: Validators.required }),
});
export const ReactiveFormControlWithForAndInitialValueAndMultiple: StoryObj<
	BrnSelectStoryArgs & { options: { value: string; label: string }[]; initialFormValue: FormGroup }
> = {
	args: {
		placeholder: 'Select multiple options',
		initialFormValue: appleAndBlueberry,
		options: [
			{ value: 'apple', label: 'Apple' },
			{ value: 'banana', label: 'Banana' },
			{ value: 'blueberry', label: 'Blueberry' },
			{ value: 'grapes', label: 'Grapes' },
			{ value: 'pineapple', label: 'Pineapple' },
		],
		multiple: true,
	},
	argTypes: {
		initialFormValue: {
			options: ['Apple', 'Apple & Blueberry', 'All'],
			mapping: {
				Apple: new FormGroup({
					fruit: new FormControl(['apple'], { validators: Validators.required }),
				}),
				'Apple & Blueberry': new FormGroup({
					fruit: new FormControl(['apple', 'blueberry'], {
						validators: Validators.required,
					}),
				}),
				All: new FormGroup({
					fruit: new FormControl(['apple', 'banana', 'blueberry', 'grapes', 'pineapple'], {
						validators: Validators.required,
					}),
				}),
			},
		},
		options: {
			control: 'inline-check',
			options: ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'],
			mapping: {
				Apple: { value: 'apple', label: 'Apple' },
				Banana: { value: 'banana', label: 'Banana' },
				Blueberry: { value: 'blueberry', label: 'Blueberry' },
				Grapes: { value: 'grapes', label: 'Grapes' },
				Pineapple: { value: 'pineapple', label: 'Pineapple' },
			},
		},
	},
	render: (args) => ({
		props: {
			...args,
		},
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ initialFormValue?.controls.fruit.value | json }}</pre>
			</div>
			<form [formGroup]="initialFormValue">
				<brn-select
					class="w-56"
					${argsToTemplate(args, { exclude: ['initialValue', 'options'] })}
					formControlName="fruit"
				>
					<hlm-select-trigger>
						<brn-select-value hlm />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						@for(option of options; track option.value){
						<hlm-option [value]="option.value">{{option.label}}</hlm-option>
						}
					</hlm-select-content>
				</brn-select>
				@if (fruitGroup?.controls.fruit.invalid && fruitGroup.controls.fruit.touched){
				<span class="text-destructive">Required</span>
				}
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
				<brn-select
					class="w-56"
					formControlName="fruit"
					${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}
				>
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
				<hlm-select
					class="w-56"
					formControlName="fruit"
					${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}
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
					${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}
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
				<hlm-select
					formControlName="fruit"
					${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}
				>
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
			</form>
		`,
	}),
};

export const Scrollable: Story = {
	render: (args) => ({
		props: { ...args, myform: new FormGroup({ timezone: new FormControl() }) },
		template: /* HTML */ `
			<form [formGroup]="myform">
				<hlm-select
					formControlName="timezone"
					${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}
				>
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
			</form>
		`,
	}),
};

export const ScrollableWithStickyLabels: Story = {
	render: (args) => ({
		props: { ...args, myform: new FormGroup({ timezone: new FormControl() }) },
		template: /* HTML */ `
			<form [formGroup]="myform">
				<hlm-select
					formControlName="timezone"
					${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}
				>
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
			</form>
		`,
	}),
};

export const CustomTrigger: Story = {
	render: (args) => ({
		props: { ...args },
		moduleMetadata: {
			imports: [CustomSelectTriggerComponent],
		},
		template: /* HTML */ `
			<hlm-select class="inline-block" ${argsToTemplate(args, { exclude: ['initialValue', 'selectValueTransformFn'] })}>
				<custom-select-trigger ngProjectAs="[brnSelectTrigger]" class="w-56">
					<hlm-select-value />
				</custom-select-trigger>
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

@Component({
	selector: 'custom-select-trigger',
	standalone: true,
	imports: [BrnSelectTriggerDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideChevronDown })],
	template: `
		<button [class]="_computedClass()" #button brnSelectTrigger type="button">
			<ng-content />
			@if (icon()) {
				<ng-content select="ng-icon" />
			} @else {
				<ng-icon hlm size="sm" class="ml-2 flex-none" name="lucideChevronDown" />
			}
		</button>
	`,
})
export class CustomSelectTriggerComponent {
	protected readonly icon = contentChild(HlmIconDirective);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'!bg-sky-500 flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]',
			this.userClass(),
		),
	);
}

export const WithLabelAndForm: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [LabelAndFormComponent],
		},
		template: /* HTML */ '<label-and-form-component/>',
	}),
};
@Component({
	selector: 'label-and-form-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		BrnSelectImports,
		HlmSelectImports,
		HlmLabelDirective,
		HlmButtonDirective,
	],
	providers: [],
	host: {
		class: '',
	},
	template: `
		<form class="space-y-5" (ngSubmit)="handleSubmit()">
			<label hlmLabel>
				Select a Fruit*
				<hlm-select class="w-56" [(ngModel)]="fruit" name="fruit" required>
					<hlm-select-trigger>
						<brn-select-value hlm />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-option [value]="undefined">No fruit</hlm-option>
						<hlm-option value="apple">Apple</hlm-option>
						<hlm-option value="banana">Banana</hlm-option>
						<hlm-option value="blueberry">Blueberry</hlm-option>
						<hlm-option value="grapes">Grapes</hlm-option>
						<hlm-option value="pineapple">Pineapple</hlm-option>
					</hlm-select-content>
				</hlm-select>
			</label>
			<button hlmBtn>Submit</button>
		</form>
	`,
})
class LabelAndFormComponent {
	public fruit = signal<string | undefined>(undefined);

	public handleSubmit(): void {
		console.log(this.fruit());
	}
}

export const DynamicOptionsMultiSelect: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [DynamicOptionsMultiSelectComponent],
		},
		template: /* HTML */ '<dynamic-options-multi-select-component/>',
	}),
};
@Component({
	selector: 'dynamic-options-multi-select-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		BrnSelectImports,
		HlmSelectImports,
		HlmLabelDirective,
		HlmButtonDirective,
	],
	providers: [],
	host: {
		class: '',
	},
	template: `
		<form class="space-y-5">
			<div class="mb-3">
				<pre>Form Control Value: {{ fruit.value | json }}</pre>
			</div>
			<label hlmLabel>
				Select a Fruit*
				<hlm-select class="w-56" [formControl]="fruit" required [multiple]="true" placeholder="Select an option">
					<hlm-select-trigger>
						<hlm-select-value />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-select-label>Fruits</hlm-select-label>
						@for (option of options(); track option.value) {
							<hlm-option [value]="option.value">{{ option.label }}</hlm-option>
						}
					</hlm-select-content>
				</hlm-select>
			</label>
		</form>
		<button hlmBtn class="mt-2" (click)="updateOptions()">Update Options</button>

		<button hlmBtn class="mt-2" (click)="updateDiffOptions()">Update Diff Options</button>

		<button hlmBtn class="mt-2" (click)="updatePartialOptions()">Update Partial Options</button>
	`,
})
class DynamicOptionsMultiSelectComponent implements OnInit {
	// Checking if an issue with having options as a signal
	public options = signal<{ value: number; label: string }[]>([]);
	fruit = new FormControl([1, 5]);

	ngOnInit(): void {
		this.options.set([
			{ label: 'Apple', value: 1 },
			{ label: 'Banana', value: 2 },
			{ label: 'Blueberry', value: 3 },
			{ label: 'Grapes', value: 4 },
			{ label: 'Pineapple', value: 5 },
		]);
	}

	public updateOptions() {
		// Reset same options
		this.options.set([
			{ label: 'Apple', value: 1 },
			{ label: 'Banana', value: 2 },
			{ label: 'Blueberry', value: 3 },
			{ label: 'Grapes', value: 4 },
			{ label: 'Pineapple', value: 5 },
		]);
	}

	public updateDiffOptions() {
		// Reset with different option values
		this.options.set([
			{ label: 'Apple', value: 6 },
			{ label: 'Banana', value: 7 },
			{ label: 'Blueberry', value: 8 },
			{ label: 'Grapes', value: 9 },
			{ label: 'Pineapple', value: 10 },
		]);
	}

	public updatePartialOptions() {
		// Reset with different option values
		this.options.set([
			{ label: 'Apple', value: 1 },
			{ label: 'Banana', value: 2 },
			{ label: 'Blueberry', value: 8 },
			{ label: 'Grapes', value: 9 },
			{ label: 'Pineapple', value: 10 },
		]);
	}
}
