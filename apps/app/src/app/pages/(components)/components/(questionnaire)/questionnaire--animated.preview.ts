import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { answerLabel } from './questionnaire.shared';

const itemClassName =
	'data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-bottom-2 data-active:duration-300 motion-reduce:animate-none';

@Component({
	selector: 'spartan-questionnaire-animated-preview',
	imports: [FormRoot, FormField, HlmQuestionnaireImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form hlmQuestionnaire class="mx-auto max-w-md" [formRoot]="form" [items]="items" defaultItem="task">
			<div hlmQuestionnaireProgress></div>

			<fieldset hlmQuestionnaireItem class="${itemClassName}" name="task" required [formField]="form.task">
				<legend hlmQuestionnaireTitle>What should the agent do?</legend>
				<p hlmQuestionnaireDescription>Choose the task for this run.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="implement">Implement the requested change</label>
					<label hlmQuestionnaireChoice value="debug">Debug the current behavior</label>
					<label hlmQuestionnaireChoice value="review">Review the implementation</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem class="${itemClassName}" name="review" required [formField]="form.review">
				<legend hlmQuestionnaireTitle>How should the work be reviewed?</legend>
				<p hlmQuestionnaireDescription>Select the verification depth.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="targeted">Targeted checks</label>
					<label hlmQuestionnaireChoice value="complete">Complete test suite</label>
					<label hlmQuestionnaireChoice value="manual">Tests and manual QA</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem class="${itemClassName}" name="delivery" required [formField]="form.delivery">
				<legend hlmQuestionnaireTitle>How should the result be delivered?</legend>
				<p hlmQuestionnaireDescription>Choose the final handoff format.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="summary">Concise summary</label>
					<label hlmQuestionnaireChoice value="diff">Summary and changed files</label>
					<label hlmQuestionnaireChoice value="handoff">Detailed review handoff</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<div hlmQuestionnaireActions>
				<button hlmQuestionnairePrevious>Previous</button>
				<button hlmQuestionnaireNext>Next</button>
				<button hlmQuestionnaireSubmit>Save workflow</button>
			</div>
		</form>
	`,
})
export class QuestionnaireAnimatedPreview {
	public readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{ name: 'task', required: true },
		{ name: 'review', required: true },
		{ name: 'delivery', required: true },
	];

	protected readonly _model = signal({
		task: '',
		review: '',
		delivery: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.task);
			required(schemaPath.review);
			required(schemaPath.delivery);
		},
		{
			submission: {
				action: async () => {
					const answers = this._model();
					toast('Agent workflow saved', {
						description: `Task: ${answerLabel(answers.task)} · Review: ${answerLabel(answers.review)} · Delivery: ${answerLabel(answers.delivery)}`,
					});
				},
			},
		},
	);
}
