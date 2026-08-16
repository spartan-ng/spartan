import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { answerLabel } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-freeform-preview',
	imports: [FormRoot, FormField, HlmQuestionnaireImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form hlmQuestionnaire class="mx-auto max-w-md" [formRoot]="form" [items]="items" shortcuts="letters">
			<fieldset hlmQuestionnaireItem name="approach" required [formField]="form.approach">
				<legend hlmQuestionnaireTitle>How should the agent approach this refactor?</legend>
				<p hlmQuestionnaireDescription>Choose a strategy or write a more specific instruction.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="incremental">Make the smallest safe change</label>
					<label hlmQuestionnaireChoice value="module">Refactor one module at a time</label>
					<label hlmQuestionnaireChoice value="rewrite">Replace the implementation completely</label>
					<input
						hlmQuestionnaireInput
						aria-label="Another refactoring approach"
						placeholder="Describe another approach…"
					/>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<div hlmQuestionnaireActions>
				<button hlmQuestionnaireSubmit>Use this approach</button>
			</div>
		</form>
	`,
})
export class QuestionnaireFreeformPreview {
	public readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{
			name: 'approach',
			required: true,
			choices: [{ value: 'incremental' }, { value: 'module' }, { value: 'rewrite' }],
		},
	];

	protected readonly _model = signal({
		approach: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.approach);
		},
		{
			submission: {
				action: async () => {
					toast('Approach selected', {
						description: `Approach: ${answerLabel(this._model().approach)}`,
					});
				},
			},
		},
	);
}
