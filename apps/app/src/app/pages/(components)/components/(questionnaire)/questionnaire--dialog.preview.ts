import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { formValue } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-dialog-preview',
	imports: [FormsModule, HlmQuestionnaireImports, HlmDialogImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<hlm-dialog>
			<button hlmDialogTrigger hlmBtn variant="outline">Open clarification</button>
			<hlm-dialog-content *hlmDialogPortal="let ctx">
				<form hlmQuestionnaire [items]="items" defaultItem="scope" (ngSubmit)="onSubmit($event)">
					<fieldset hlmQuestionnaireItem name="scope" required>
						<hlm-dialog-header>
							<div hlmQuestionnaireProgress></div>
							<legend hlmQuestionnaireTitle hlmDialogTitle>Which files are in scope?</legend>
							<p hlmQuestionnaireDescription hlmDialogDescription>
								Choose how broadly the agent can update the workspace.
							</p>
						</hlm-dialog-header>
						<div hlmQuestionnaireChoices>
							<label hlmQuestionnaireChoice value="component">Component only</label>
							<label hlmQuestionnaireChoice value="feature">Complete feature directory</label>
							<label hlmQuestionnaireChoice value="workspace">Any related workspace file</label>
						</div>
						<p hlmQuestionnaireError></p>
					</fieldset>

					<fieldset hlmQuestionnaireItem name="tests" required>
						<hlm-dialog-header>
							<div hlmQuestionnaireProgress></div>
							<legend hlmQuestionnaireTitle hlmDialogTitle>How much verification is needed?</legend>
							<p hlmQuestionnaireDescription hlmDialogDescription>
								Choose the checks the agent should run before handoff.
							</p>
						</hlm-dialog-header>
						<div hlmQuestionnaireChoices>
							<label hlmQuestionnaireChoice value="targeted">Targeted tests</label>
							<label hlmQuestionnaireChoice value="package">Package tests</label>
							<label hlmQuestionnaireChoice value="full">Full workspace verification</label>
						</div>
						<p hlmQuestionnaireError></p>
					</fieldset>

					<hlm-dialog-footer>
						<button hlmBtn type="button" variant="outline" hlmDialogClose>Cancel</button>
						<div hlmQuestionnaireActions>
							<button hlmQuestionnairePrevious>Previous</button>
							<button hlmQuestionnaireNext>Next</button>
							<button hlmQuestionnaireSubmit>Send answer</button>
						</div>
					</hlm-dialog-footer>
				</form>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class QuestionnaireDialogPreview {
	private readonly _dialog = viewChild(BrnDialog);

	protected readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{ name: 'scope', required: true },
		{ name: 'tests', required: true },
	];

	protected onSubmit(event: Event): void {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		this._dialog()?.close({});
		toast('Clarification sent', {
			description: `Scope: ${formValue(form, 'scope')} · Verification: ${formValue(form, 'tests')}`,
		});
	}
}
