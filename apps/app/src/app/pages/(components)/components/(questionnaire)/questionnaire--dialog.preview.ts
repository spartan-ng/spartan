import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { answerLabel } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-dialog-preview',
	imports: [FormRoot, FormField, HlmQuestionnaireImports, HlmDialogImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<hlm-dialog>
			<button hlmDialogTrigger hlmBtn variant="outline">Open clarification</button>
			<hlm-dialog-content *hlmDialogPortal="let ctx">
				<form hlmQuestionnaire [formRoot]="form" [items]="items" defaultItem="scope">
					<fieldset hlmQuestionnaireItem name="scope" required [formField]="form.scope">
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

					<fieldset hlmQuestionnaireItem name="tests" required [formField]="form.tests">
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

	public readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{ name: 'scope', required: true },
		{ name: 'tests', required: true },
	];

	protected readonly _model = signal({
		scope: '',
		tests: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.scope);
			required(schemaPath.tests);
		},
		{
			submission: {
				action: async () => {
					const answers = this._model();
					this._dialog()?.close({});
					toast('Clarification sent', {
						description: `Scope: ${answerLabel(answers.scope)} · Verification: ${answerLabel(answers.tests)}`,
					});
				},
			},
		},
	);
}
