import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { answerLabel } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-card-preview',
	imports: [FormRoot, FormField, HlmQuestionnaireImports, HlmCardImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form
			hlmQuestionnaire
			class="mx-auto max-w-md"
			[formRoot]="form"
			[items]="items"
			defaultItem="task"
			shortcuts="numbers"
		>
			<hlm-card>
				<fieldset hlmQuestionnaireItem name="task" required aria-labelledby="task-title" [formField]="form.task">
					<hlm-card-header>
						<legend hlmQuestionnaireTitle hlmCardTitle id="task-title">What should the agent work on?</legend>
						<p hlmQuestionnaireDescription hlmCardDescription>Choose the task that should be handled next.</p>
						<div hlmCardAction>
							<div hlmQuestionnaireProgress></div>
						</div>
					</hlm-card-header>
					<div hlmCardContent>
						<div hlmQuestionnaireChoices>
							<label hlmQuestionnaireChoice value="fix">Fix the failing tests</label>
							<label hlmQuestionnaireChoice value="refactor">Refactor the data layer</label>
							<label hlmQuestionnaireChoice value="docs">Update the integration guide</label>
						</div>
						<p hlmQuestionnaireError></p>
					</div>
				</fieldset>

				<fieldset hlmQuestionnaireItem name="output" required aria-labelledby="output-title" [formField]="form.output">
					<hlm-card-header>
						<legend hlmQuestionnaireTitle hlmCardTitle id="output-title">What should the final handoff include?</legend>
						<p hlmQuestionnaireDescription hlmCardDescription>Pick the level of detail needed for review.</p>
						<div hlmCardAction>
							<div hlmQuestionnaireProgress></div>
						</div>
					</hlm-card-header>
					<div hlmCardContent>
						<div hlmQuestionnaireChoices>
							<label hlmQuestionnaireChoice value="summary">Summary only</label>
							<label hlmQuestionnaireChoice value="files">Summary and changed files</label>
							<label hlmQuestionnaireChoice value="review">Full review handoff</label>
						</div>
						<p hlmQuestionnaireError></p>
					</div>
				</fieldset>

				<hlm-card-footer>
					<div hlmQuestionnaireActions class="w-full">
						<button hlmQuestionnairePrevious>Previous</button>
						<button hlmQuestionnaireNext>Next</button>
						<button hlmQuestionnaireSubmit>Create task</button>
					</div>
				</hlm-card-footer>
			</hlm-card>
		</form>
	`,
})
export class QuestionnaireCardPreview {
	public readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{
			name: 'task',
			required: true,
			choices: [{ value: 'fix' }, { value: 'refactor' }, { value: 'docs' }],
		},
		{
			name: 'output',
			required: true,
			choices: [{ value: 'summary' }, { value: 'files' }, { value: 'review' }],
		},
	];

	protected readonly _model = signal({
		task: '',
		output: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.task);
			required(schemaPath.output);
		},
		{
			submission: {
				action: async () => {
					const answers = this._model();
					toast('Agent task created', {
						description: `Task: ${answerLabel(answers.task)} · Handoff: ${answerLabel(answers.output)}`,
					});
				},
			},
		},
	);
}
