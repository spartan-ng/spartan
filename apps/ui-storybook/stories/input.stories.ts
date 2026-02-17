import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

const meta: Meta<HlmInput> = {
	title: 'Input',
	component: HlmInput,
	tags: ['autodocs'],
	args: {
		error: 'auto',
	},
	argTypes: {
		error: {
			options: ['auto', 'true'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmInput, HlmLabel, HlmButton, FormsModule, ReactiveFormsModule, HlmFieldImports],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmInput>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <input aria-label='Email' class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email'/>
    `,
	}),
};

export const File: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <label hlmLabel for="picture">Picture</label>
      <input class='w-80' hlmInput ${argsToTemplate(args)} id="picture" type="file" />
    </div>`,
	}),
};

export const Disabled: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <input aria-label='Email' disabled class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email'/>
    `,
	}),
};

export const Required: Story = {
	render: ({ ...args }) => ({
		props: { value: '', ...args },
		template: `
    <input aria-label='Email *' [(ngModel)]="value" class='w-80' hlmInput ${argsToTemplate(args)} type='email' required placeholder='Email *'/>
    `,
	}),
};

export const Error: Story = {
	render: ({ ...args }) => ({
		props: { ...args, error: 'true' },
		template: `
    <input aria-label='Email' class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email' />
    `,
	}),
};

export const WithButton: Story = {
	name: 'With Button',
	render: ({ ...args }) => ({
		props: args,
		template: `
    <div class="flex items-center w-full max-w-sm space-x-2">
    <input aria-label='Email' class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email'/>
    <button hlmBtn>Subscribe</button>
    </div>
    `,
	}),
};

export const WithHintAndError: Story = {
	render: () => ({
		props: {
			form: new FormGroup({
				email: new FormControl('', { validators: [Validators.required, Validators.email] }),
			}),
		},
		template: `
		@let emailControl = form.get('email');
		@let showError = emailControl?.invalid && (emailControl?.touched );

		<form [formGroup]="form" class="space-y-3 w-full max-w-sm">
			<div hlmField >
				<label hlmFieldLabel for="input-hint">Email *</label>
				<input
					hlmInput
					id="input-hint"
					type="email"
					formControlName="email"
					placeholder="you@example.com"
					class="w-full"
				/>

				<p hlmFieldDescription>We’ll use this email for notifications.</p>

@if(showError){
				<hlm-field-error>Enter a valid email address to continue.</hlm-field-error>
}
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
				<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
			</div>
		</form>
		`,
	}),
};
