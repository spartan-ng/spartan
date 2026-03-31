import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit, ViewEncapsulation, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCitrus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

interface BrnSelectStoryArgs {
	value: string;
	disabled: boolean;
	placeholder: string;
}

const meta: Meta<BrnSelectStoryArgs> = {
	title: 'Select',
	args: {
		disabled: false,
		value: '',
		placeholder: 'Select an option',
	},
	decorators: [
		moduleMetadata({
			imports: [
				CommonModule,
				FormsModule,
				ReactiveFormsModule,
				HlmSelectImports,
				HlmFieldImports,
				HlmButton,
				HlmLabel,
				NgIcon,
			],
			providers: [provideIcons({ lucideCitrus })],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnSelectStoryArgs>;

export const Default: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-select ${argsToTemplate(args, { exclude: ['value', 'placeholder'] })}>
				<hlm-select-trigger class="w-56">
					<hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-select-item value="apple">Apple</hlm-select-item>
						<hlm-select-item value="banana">Banana</hlm-select-item>
						<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
						<hlm-select-item value="grapes">Grapes</hlm-select-item>
						<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select>
		`,
	}),
};

export const Multiple: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-select-multiple ${argsToTemplate(args, { exclude: ['value', 'placeholder'] })}>
				<hlm-select-trigger class="w-56">
					<hlm-select-placeholder>Select fruits</hlm-select-placeholder>
					<ng-template hlmSelectValues let-values>
						<hlm-select-values-content>@for (value of values; track value) { {{ value }} }</hlm-select-values-content>
					</ng-template>
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-select-item value="apple">Apple</hlm-select-item>
						<hlm-select-item value="banana">Banana</hlm-select-item>
						<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
						<hlm-select-item value="grapes">Grapes</hlm-select-item>
						<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select-multiple>
		`,
	}),
};

export const ReactiveFormControl: Story = {
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl(args.value) }) },
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.value | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<hlm-select class="w-56" ${argsToTemplate(args, { exclude: ['value', 'placeholder'] })} formControlName="fruit">
					<hlm-select-trigger>
						<hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal>
						<hlm-select-group>
							<hlm-select-label>Fruits</hlm-select-label>
							<hlm-select-item value="apple">Apple</hlm-select-item>
							<hlm-select-item value="banana">Banana</hlm-select-item>
							<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
							<hlm-select-item value="grapes">Grapes</hlm-select-item>
							<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select>
			</form>
		`,
	}),
};

export const DisabledOption: Story = {
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl(args.value) }) },
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.value | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<hlm-select class="w-56" ${argsToTemplate(args, { exclude: ['value', 'placeholder'] })} formControlName="fruit">
					<hlm-select-trigger>
						<hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal>
						<hlm-select-group>
							<hlm-select-label>Fruits</hlm-select-label>
							<hlm-select-item value="apple">Apple</hlm-select-item>
							<hlm-select-item data-testid="banana-option" value="banana" disabled>Banana</hlm-select-item>
							<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
							<hlm-select-item value="grapes">Grapes</hlm-select-item>
							<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select>
			</form>
		`,
	}),
};

export const SelectItemToString: Story = {
	render: (args) => ({
		props: {
			...args,
			fruitGroup: new FormGroup({ fruit: new FormControl(args.value) }),
			itemToString: (value: string) => {
				return value.toUpperCase();
			},
			multiple: true,
		},
		template: /* HTML */ `
			<div class="mb-3" (onClick)="console.log('CLICKED')">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.value | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<hlm-select
					class="w-56"
					${argsToTemplate(args, { exclude: ['value'] })}
					formControlName="fruit"
					[itemToString]="itemToString"
				>
					<hlm-select-trigger>
						<hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal>
						<hlm-select-group>
							<hlm-select-label>Fruits</hlm-select-label>
							<hlm-select-item value="apple">Apple</hlm-select-item>
							<hlm-select-item data-testid="banana-option" value="banana" disabled>Banana</hlm-select-item>
							<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
							<hlm-select-item value="grapes">Grapes</hlm-select-item>
							<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select>
			</form>
		`,
	}),
};

export const ReactiveFormControlWithForAndInitialValue: Story = {
	args: {
		value: 'apple',
	},
	render: (args) => ({
		props: {
			...args,
			fruitGroup: new FormGroup({
				fruit: new FormControl(args.value || null, { validators: Validators.required }),
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
				<hlm-select class="w-56" ${argsToTemplate(args, { exclude: ['value'] })} formControlName="fruit">
					<hlm-select-trigger>
						<hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal>
						<hlm-select-group>
							<hlm-select-label>Fruits</hlm-select-label>
							@for(option of options; track option.value){
							<hlm-select-item [value]="option.value">{{option.label}}</hlm-select-item>
							}
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select>
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
		initialFormValue: appleAndBlueberry,
		options: [
			{ value: 'apple', label: 'Apple' },
			{ value: 'banana', label: 'Banana' },
			{ value: 'blueberry', label: 'Blueberry' },
			{ value: 'grapes', label: 'Grapes' },
			{ value: 'pineapple', label: 'Pineapple' },
		],
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
				<hlm-select-multiple
					class="w-56"
					${argsToTemplate(args, { exclude: ['value', 'options', 'placeholder', 'initialFormValue'] })}
					formControlName="fruit"
				>
					<hlm-select-trigger>
						<hlm-select-placeholder>Select fruits</hlm-select-placeholder>
						<ng-template hlmSelectValues let-values>
							<hlm-select-values-content>@for (value of values; track value) { {{ value }} }</hlm-select-values-content>
						</ng-template>
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal>
						<hlm-select-group>
							<hlm-select-label>Fruits</hlm-select-label>
							@for(option of options; track option.value){
							<hlm-select-item [value]="option.value">{{option.label}}</hlm-select-item>
							}
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select-multiple>
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
				fruit: new FormControl(args.value || null, { validators: Validators.required }),
			}),
		},
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.valueChanges | async | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<hlm-select class="w-56" formControlName="fruit" ${argsToTemplate(args, { exclude: ['value', 'placeholder'] })}>
					<hlm-select-trigger>
						<hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal>
						<hlm-select-group>
							<hlm-select-label>Fruits</hlm-select-label>
							<hlm-select-item value="apple">Apple</hlm-select-item>
							<hlm-select-item value="banana">Banana</hlm-select-item>
							<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
							<hlm-select-item value="grapes">Grapes</hlm-select-item>
							<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select>
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
				fruit: new FormControl(args.value || null, { validators: Validators.required }),
			}),
		},
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ fruitGroup.controls.fruit.valueChanges | async | json }}</pre>
			</div>
			<form [formGroup]="fruitGroup">
				<label hlmLabel>Select a Fruit</label>
				<hlm-select class="w-56" formControlName="fruit" ${argsToTemplate(args, { exclude: ['value'] })}>
					<hlm-select-trigger>
						<hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal>
						<hlm-select-group>
							<hlm-select-label>Fruits</hlm-select-label>
							<hlm-select-item value="apple">Apple</hlm-select-item>
							<hlm-select-item value="banana">Banana</hlm-select-item>
							<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
							<hlm-select-item value="grapes">Grapes</hlm-select-item>
							<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select>
				@if (fruitGroup.controls.fruit.invalid && fruitGroup.controls.fruit.touched){
				<span class="text-destructive">Required</span>
				}
			</form>
		`,
	}),
};

export const WithHintAndError: Story = {
	render: (args) => ({
		props: {
			...args,
			form: new FormGroup({
				fruit: new FormControl('', { validators: [Validators.required] }),
			}),
		},
		template: /* HTML */ `
			<form [formGroup]="form" class="w-full max-w-sm space-y-3">
				<div hlmField>
					<label hlmFieldLabel>Fruit *</label>
					<hlm-select
						class="w-56"
						formControlName="fruit"
						${argsToTemplate(args, { exclude: ['value', 'placeholder'] })}
					>
						<hlm-select-trigger>
							<hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
						</hlm-select-trigger>
						<hlm-select-content *hlmSelectPortal>
							<hlm-select-group>
								<hlm-select-label>Fruits</hlm-select-label>
								<hlm-option value="apple">Apple</hlm-option>
								<hlm-option value="banana">Banana</hlm-option>
								<hlm-option value="blueberry">Blueberry</hlm-option>
								<hlm-option value="grapes">Grapes</hlm-option>
								<hlm-option value="pineapple">Pineapple</hlm-option>
							</hlm-select-group>
						</hlm-select-content>
					</hlm-select>

					<p hlmFieldDescription>Pick a fruit so we can tailor the recommendations.</p>

					<hlm-field-error>Select your favorite fruit to continue.</hlm-field-error>
				</div>

				<div class="flex flex-wrap items-center gap-2">
					<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
					<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
				</div>
			</form>
		`,
	}),
};

export const NgModelFormControl: Story = {
	render: (args) => ({
		props: {
			...args,
			fruit: signal(args.value),
		},
		template: /* HTML */ `
			<form ngForm>
				<div class="mb-3">
					<pre>Form Control Value: {{fruit() | json }}</pre>
				</div>
				<label hlmLabel>Select a Fruit</label>
				<hlm-select class="w-56" ${argsToTemplate(args, { exclude: ['value'] })} [(ngModel)]="fruit" name="fruit">
					<hlm-select-trigger>
						<hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal>
						<hlm-select-group>
							<hlm-select-label>Fruits</hlm-select-label>
							<hlm-select-item value="apple">Apple</hlm-select-item>
							<hlm-select-item value="banana">Banana</hlm-select-item>
							<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
							<hlm-select-item value="grapes">Grapes</hlm-select-item>
							<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select>
			</form>
		`,
	}),
};

export const NgModelFormControlInitialValue: Story = {
	args: {
		disabled: false,
		value: 'apple',
	},

	render: (args) => ({
		props: {
			...args,
			fruit: signal(args.value),
		},

		template: `
            <form ngForm>
                <div class="mb-3">
                    <pre>Form Control Value: {{fruit() | json }}</pre>
                </div>
                    <label hlmLabel>Select a Fruit</label>
                <hlm-select
                    class="w-56"
                    ${argsToTemplate(args, {
											exclude: ['value'],
										})}
                    [(ngModel)]="fruit"
                    name="fruit"
                >
                    <hlm-select-trigger>
                        <hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
                    </hlm-select-trigger>
                    <hlm-select-content *hlmSelectPortal>
						<hlm-select-group>
                        	<hlm-select-label>Fruits</hlm-select-label>
                        	<hlm-select-item value="apple">Apple</hlm-select-item>
                        	<hlm-select-item value="banana">Banana</hlm-select-item>
                        	<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
                        	<hlm-select-item value="grapes">Grapes</hlm-select-item>
                        	<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
                    	</hlm-select-group>
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
				<label hlmLabel for="select-trigger">Select a Fruit</label>
				<hlm-select formControlName="fruit" ${argsToTemplate(args, { exclude: ['value'] })}>
					<hlm-select-trigger class="w-56" buttonId="select-trigger">
						<hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal class="w-56">
						<hlm-select-group>
							<hlm-select-label>Fruits</hlm-select-label>
							<hlm-select-item value="apple">Apple</hlm-select-item>
							<hlm-select-item value="banana">Banana</hlm-select-item>
							<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
							<hlm-select-item value="grapes">Grapes</hlm-select-item>
							<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
						</hlm-select-group>
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
				<hlm-select formControlName="timezone" ${argsToTemplate(args, { exclude: ['value', 'placeholder'] })}>
					<hlm-select-trigger class="w-[280px]">
						<hlm-select-value ${argsToTemplate(args, { include: ['placeholder'] })} />
					</hlm-select-trigger>
					<hlm-select-content *hlmSelectPortal showScroll class="min-w-content max-h-96">
						<hlm-select-group>
							<hlm-select-label>North America</hlm-select-label>
							<hlm-select-item value="est">Eastern Standard Time (EST)</hlm-select-item>
							<hlm-select-item value="cst">Central Standard Time (CST)</hlm-select-item>
							<hlm-select-item value="mst">Mountain Standard Time (MST)</hlm-select-item>
							<hlm-select-item value="pst">Pacific Standard Time (PST)</hlm-select-item>
							<hlm-select-item value="akst">Alaska Standard Time (AKST)</hlm-select-item>
							<hlm-select-item value="hst">Hawaii Standard Time (HST)</hlm-select-item>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>Europe & Africa</hlm-select-label>
							<hlm-select-item value="gmt">Greenwich Mean Time (GMT)</hlm-select-item>
							<hlm-select-item value="cet">Central European Time (CET)</hlm-select-item>
							<hlm-select-item value="eet">Eastern European Time (EET)</hlm-select-item>
							<hlm-select-item value="west">Western European Summer Time (WEST)</hlm-select-item>
							<hlm-select-item value="cat">Central Africa Time (CAT)</hlm-select-item>
							<hlm-select-item value="eat">East Africa Time (EAT)</hlm-select-item>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>Asia</hlm-select-label>
							<hlm-select-item value="msk">Moscow Time (MSK)</hlm-select-item>
							<hlm-select-item value="ist">India Standard Time (IST)</hlm-select-item>
							<hlm-select-item value="cst_china">China Standard Time (CST)</hlm-select-item>
							<hlm-select-item value="jst">Japan Standard Time (JST)</hlm-select-item>
							<hlm-select-item value="kst">Korea Standard Time (KST)</hlm-select-item>
							<hlm-select-item value="ist_indonesia">Indonesia Central Standard Time (WITA)</hlm-select-item>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>Australia & Pacific</hlm-select-label>
							<hlm-select-item value="awst">Australian Western Standard Time (AWST)</hlm-select-item>
							<hlm-select-item value="acst">Australian Central Standard Time (ACST)</hlm-select-item>
							<hlm-select-item value="aest">Australian Eastern Standard Time (AEST)</hlm-select-item>
							<hlm-select-item value="nzst">New Zealand Standard Time (NZST)</hlm-select-item>
							<hlm-select-item value="fjt">Fiji Time (FJT)</hlm-select-item>
						</hlm-select-group>

						<hlm-select-group>
							<hlm-select-label>South America</hlm-select-label>
							<hlm-select-item value="art">Argentina Time (ART)</hlm-select-item>
							<hlm-select-item value="bot">Bolivia Time (BOT)</hlm-select-item>
							<hlm-select-item value="brt">Brasilia Time (BRT)</hlm-select-item>
							<hlm-select-item value="clt">Chile Standard Time (CLT)</hlm-select-item>
						</hlm-select-group>
					</hlm-select-content>
				</hlm-select>
			</form>
		`,
	}),
};

export const CustomPlaceholder: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-select class="inline-block" ${argsToTemplate(args, { exclude: ['value'] })}>
				<hlm-select-trigger class="w-56">
					<hlm-select-placeholder>
						<ng-icon name="lucideCitrus" />
						Select a fruit
					</hlm-select-placeholder>
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-select-item value="apple">Apple</hlm-select-item>
						<hlm-select-item value="banana">Banana</hlm-select-item>
						<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
						<hlm-select-item value="grapes">Grapes</hlm-select-item>
						<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select>
		`,
	}),
};

export const WithLabelAndForm: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [LabelAndForm],
		},
		template: /* HTML */ '<label-and-form-component/>',
	}),
};
@Component({
	selector: 'label-and-form-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, ReactiveFormsModule, HlmSelectImports, HlmLabel, HlmButton],
	providers: [],
	host: {
		class: '',
	},
	template: `
		<form class="space-y-5" (ngSubmit)="handleSubmit()">
			<label hlmLabel>Select a Fruit*</label>
			<hlm-select class="w-56" [(ngModel)]="fruit">
				<hlm-select-trigger>
					<hlm-select-value placeholder="Select a fruit" />
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						<hlm-select-label>Fruits</hlm-select-label>
						<hlm-select-item value="apple">Apple</hlm-select-item>
						<hlm-select-item value="banana">Banana</hlm-select-item>
						<hlm-select-item value="blueberry">Blueberry</hlm-select-item>
						<hlm-select-item value="grapes">Grapes</hlm-select-item>
						<hlm-select-item value="pineapple">Pineapple</hlm-select-item>
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select>
			<button hlmBtn>Submit</button>
		</form>
	`,
})
class LabelAndForm {
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
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, ReactiveFormsModule, HlmSelectImports, HlmLabel, HlmButton, JsonPipe],
	providers: [],
	host: {
		class: '',
	},
	template: `
		<form class="space-y-5">
			<div class="mb-3">
				<pre>Form Control Value: {{ fruit.value | json }}</pre>
			</div>
			<label hlmLabel>Select a Fruit*</label>
			<hlm-select-multiple class="w-56" [formControl]="fruit">
				<hlm-select-trigger>
					<hlm-select-placeholder>Select an option</hlm-select-placeholder>
					<ng-template hlmSelectValues let-values>
						<hlm-select-values-content>
							@for (value of values; track value) {
								{{ itemToString(value) }}
							}
						</hlm-select-values-content>
					</ng-template>
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						<hlm-select-label>Fruits</hlm-select-label>
						@for (option of options(); track option.value) {
							<hlm-select-item [value]="option.value">{{ option.label }}</hlm-select-item>
						}
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select-multiple>
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

	itemToString = (value: number) => this.options().find((option) => option.value === value)?.label || '';

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
