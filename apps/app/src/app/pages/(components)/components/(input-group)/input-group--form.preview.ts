import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-input-group-form-preview',
	imports: [ReactiveFormsModule, HlmInputGroupImports, HlmLabelImports, HlmIconImports, HlmTooltipImports],
	providers: [provideIcons({ lucideInfo })],
	host: {
		class: 'grid w-full max-w-sm gap-6',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<div hlmInputGroup>
				<input hlmInputGroupInput id="email-form" placeholder="spartan-ng@github.com" formControlName="email" />
				<div hlmInputGroupAddon align="block-start">
					<label for="email-form" class="text-foreground" hlmLabel>Email</label>
					<button
						hlmInputGroupButton
						hlmTooltipTrigger="We'll use this to send you notifications"
						variant="ghost"
						aria-label="Help"
						class="ml-auto rounded-full"
						size="icon-xs"
					>
						<ng-icon name="lucideInfo" />
					</button>
				</div>
				<div hlmInputGroupAddon align="block-end">
					<button
						hlmInputGroupButton
						class="ml-auto"
						size="sm"
						variant="default"
						type="submit"
						[disabled]="form.invalid"
					>
						Submit
					</button>
				</div>
			</div>
		</form>
	`,
})
export class InputGroupFormPreview {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		email: [null, [Validators.required, Validators.email]],
	});

	submit() {
		console.log(this.form.value);
	}
}
