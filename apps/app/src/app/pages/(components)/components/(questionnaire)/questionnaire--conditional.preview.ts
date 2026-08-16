import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { answerLabel } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-conditional-preview',
	imports: [FormRoot, FormField, HlmQuestionnaireImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form hlmQuestionnaire class="mx-auto max-w-md" [formRoot]="form" [items]="items()" defaultItem="runtime">
			<div hlmQuestionnaireProgress></div>

			<fieldset hlmQuestionnaireItem name="runtime" required [formField]="form.runtime">
				<legend hlmQuestionnaireTitle>Where should the agent run?</legend>
				<p hlmQuestionnaireDescription>Cloud runs add an environment question to this flow.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="local">Local workspace</label>
					<label hlmQuestionnaireChoice value="cloud">Cloud workspace</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset
				hlmQuestionnaireItem
				name="environment"
				required
				[formField]="form.environment"
				[disabled]="_model().runtime !== 'cloud'"
			>
				<legend hlmQuestionnaireTitle>Which cloud environment should it use?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="preview">Preview</label>
					<label hlmQuestionnaireChoice value="staging">Staging</label>
					<label hlmQuestionnaireChoice value="isolated">Isolated sandbox</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="approval" required [formField]="form.approval">
				<legend hlmQuestionnaireTitle>When should the agent request approval?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="writes">Before writing files</label>
					<label hlmQuestionnaireChoice value="commands">Before running commands</label>
					<label hlmQuestionnaireChoice value="sensitive">Only for sensitive actions</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<div hlmQuestionnaireActions>
				<button hlmQuestionnairePrevious>Previous</button>
				<button hlmQuestionnaireNext>Next</button>
				<button hlmQuestionnaireSubmit>Save execution plan</button>
			</div>
		</form>
	`,
})
export class QuestionnaireConditionalPreview {
	protected readonly _model = signal({
		runtime: 'local',
		environment: '',
		approval: '',
	});

	public readonly items = computed(() => [
		{ name: 'runtime', required: true },
		{
			name: 'environment',
			required: true,
			disabled: this._model().runtime !== 'cloud',
		},
		{ name: 'approval', required: true },
	]);

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.runtime);
			required(schemaPath.approval);
		},
		{
			submission: {
				action: async () => {
					const answers = this._model();
					toast('Execution plan saved', {
						description: `Runtime: ${answerLabel(answers.runtime)} · Environment: ${answerLabel(answers.environment, 'Not applicable')} · Approval: ${answerLabel(answers.approval)}`,
					});
				},
			},
		},
	);
}
