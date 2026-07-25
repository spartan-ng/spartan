import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';

import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-input-group-form-preview',
	imports: [FormRoot, FormField, HlmInputGroupImports, HlmLabelImports, HlmTooltipImports, NgIcon],
	providers: [provideIcons({ lucideInfo })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'grid w-full max-w-sm gap-6' },
	template: `
		<form [formRoot]="form">
			<hlm-input-group>
				<input hlmInputGroupInput id="email-form" placeholder="spartan-ng@github.com" [formField]="form.email" />
				<hlm-input-group-addon align="block-start">
					<label for="email-form" class="text-foreground" hlmLabel>Email</label>
					<button
						hlmInputGroupButton
						[hlmTooltip]="tooltip"
						variant="ghost"
						aria-label="Help"
						class="ml-auto rounded-full"
						size="icon-xs"
					>
						<ng-icon name="lucideInfo" />
					</button>
					<ng-template #tooltip>We'll use this to send you notifications</ng-template>
				</hlm-input-group-addon>
				<hlm-input-group-addon align="block-end">
					<button
						hlmInputGroupButton
						class="ml-auto"
						size="sm"
						variant="default"
						type="submit"
						[disabled]="form().submitting()"
					>
						Submit
					</button>
				</hlm-input-group-addon>
			</hlm-input-group>
		</form>
	`,
})
export class InputGroupFormPreview {
	protected readonly _model = signal({
		email: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.email, { message: 'Email is required' });
			email(schemaPath.email, { message: 'Enter a valid email address' });
		},
		{
			submission: {
				action: async () => {
					const model = this._model();
					console.log(model);
				},
			},
		},
	);
}
