import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { answerLabel } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-multiple-preview',
	imports: [FormRoot, FormField, HlmQuestionnaireImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form hlmQuestionnaire class="mx-auto max-w-md" [formRoot]="form" [items]="items" shortcuts="letters">
			<fieldset hlmQuestionnaireItem name="context" multiple required [formField]="form.context">
				<legend hlmQuestionnaireTitle>What context should the agent inspect?</legend>
				<p hlmQuestionnaireDescription>Select every source that may affect the implementation.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="source">Relevant source files</label>
					<label hlmQuestionnaireChoice value="tests">Existing tests</label>
					<label hlmQuestionnaireChoice value="docs">Architecture documentation</label>
					<label hlmQuestionnaireChoice value="history">Recent commit history</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<div hlmQuestionnaireActions>
				<button hlmQuestionnaireSubmit>Share context</button>
			</div>
		</form>
	`,
})
export class QuestionnaireMultiplePreview {
	public readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{
			name: 'context',
			required: true,
			choices: [{ value: 'source' }, { value: 'tests' }, { value: 'docs' }, { value: 'history' }],
		},
	];

	protected readonly _model = signal({
		context: [] as string[],
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.context);
		},
		{
			submission: {
				action: async () => {
					toast('Context selected', {
						description: `Context: ${answerLabel(this._model().context)}`,
					});
				},
			},
		},
	);
}
