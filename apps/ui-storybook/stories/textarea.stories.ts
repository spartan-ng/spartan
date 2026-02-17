import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';

export default {
	title: 'Textarea',
	component: HlmTextarea,
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
			imports: [HlmTextarea, HlmLabel, HlmButton, FormsModule, ReactiveFormsModule, HlmFieldImports],
		}),
	],
} as Meta<HlmTextarea>;

type Story = StoryObj<HlmTextarea>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
			<textarea hlmTextarea class="w-80" placeholder="Type your message here." ${argsToTemplate(args)}></textarea>
		`,
	}),
};

export const Disabled: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
			<textarea hlmTextarea disabled class="w-80" placeholder="Type your message here." ${argsToTemplate(args)}></textarea>
		`,
	}),
};

export const Required: Story = {
	render: ({ ...args }) => ({
		props: { value: '', ...args },
		template: `
			<textarea hlmTextarea required [(ngModel)]="value" class="w-80" placeholder="Type your message here.*" ${argsToTemplate(args)}></textarea>
		`,
	}),
};

export const Error: Story = {
	render: ({ ...args }) => ({
		props: { ...args, error: 'true' },
		template: `
			<textarea hlmTextarea class="w-80" placeholder="Type your message here.*" ${argsToTemplate(args)}></textarea>
		`,
	}),
};

export const WithButton: Story = {
	name: 'With Button',
	render: ({ ...args }) => ({
		props: args,
		template: `
			<div class="w-80 grid gap-2">
				<textarea hlmTextarea placeholder="Type your message here." ${argsToTemplate(args)}></textarea>
				<button hlmBtn>Subscribe</button>
			</div>
		`,
	}),
};

export const WithHintAndError: Story = {
	render: () => ({
		props: {
			form: new FormGroup({
				message: new FormControl('', { validators: [Validators.required] }),
			}),
		},
		template: `
		@let messageControl = form.get('message');
		@let showError = messageControl?.invalid && (messageControl?.touched || messageControl?.dirty);

		<form [formGroup]="form" class="space-y-3 w-full max-w-sm">
			<div hlmField [attr.data-invalid]="showError ? 'true' : null">
				<label hlmFieldLabel for="textarea-hint">Message *</label>
				<textarea
					hlmTextarea
					id="textarea-hint"
					formControlName="message"
					class="w-full"
					rows="3"
					placeholder="Share your thoughts..."
				></textarea>

				<p hlmFieldDescription>Tell us what you’re working on so we can help.</p>

@if(showError){
				<hlm-field-error >Please enter a message before continuing.</hlm-field-error>
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
