import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { answerLabel } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-progress-preview',
	imports: [FormRoot, FormField, HlmQuestionnaireImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form hlmQuestionnaire class="mx-auto max-w-md" [formRoot]="form" [items]="items" defaultItem="scope">
			<div hlmQuestionnaireProgress #progress="hlmQuestionnaireProgress" class="w-full">
				<div class="mb-2 flex gap-1.5" aria-hidden="true">
					@for (filled of progress.segments(); track $index) {
						<span
							[attr.data-filled]="filled || null"
							class="data-filled:bg-primary bg-muted h-1.5 flex-1 rounded-full transition-colors"
						></span>
					}
				</div>
				<span>Checkpoint {{ progress.current() }} of {{ progress.total() }}</span>
			</div>

			<fieldset hlmQuestionnaireItem name="scope" required [formField]="form.scope">
				<legend hlmQuestionnaireTitle>How large is the change?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="small">Small patch</label>
					<label hlmQuestionnaireChoice value="medium">Feature-sized change</label>
					<label hlmQuestionnaireChoice value="large">Cross-package change</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="strategy" required [formField]="form.strategy">
				<legend hlmQuestionnaireTitle>How should commits be organized?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="single">Single commit</label>
					<label hlmQuestionnaireChoice value="logical">Logical commits</label>
					<label hlmQuestionnaireChoice value="squash">Squash before review</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="tests" required [formField]="form.tests">
				<legend hlmQuestionnaireTitle>Which tests should run?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="targeted">Targeted tests</label>
					<label hlmQuestionnaireChoice value="package">Package suite</label>
					<label hlmQuestionnaireChoice value="workspace">Full workspace</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="delivery" required [formField]="form.delivery">
				<legend hlmQuestionnaireTitle>How should the work be delivered?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="patch">Patch only</label>
					<label hlmQuestionnaireChoice value="commit">Committed locally</label>
					<label hlmQuestionnaireChoice value="branch">Push a review branch</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<div hlmQuestionnaireActions>
				<button hlmQuestionnairePrevious>Previous</button>
				<button hlmQuestionnaireNext>Next</button>
				<button hlmQuestionnaireSubmit>Finish plan</button>
			</div>
		</form>
	`,
})
export class QuestionnaireProgressPreview {
	public readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{ name: 'scope', required: true },
		{ name: 'strategy', required: true },
		{ name: 'tests', required: true },
		{ name: 'delivery', required: true },
	];

	protected readonly _model = signal({
		scope: '',
		strategy: '',
		tests: '',
		delivery: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.scope);
			required(schemaPath.strategy);
			required(schemaPath.tests);
			required(schemaPath.delivery);
		},
		{
			submission: {
				action: async () => {
					const answers = this._model();
					toast('Pull request plan ready', {
						description: `Scope: ${answerLabel(answers.scope)} · Commits: ${answerLabel(answers.strategy)} · Tests: ${answerLabel(answers.tests)} · Delivery: ${answerLabel(answers.delivery)}`,
					});
				},
			},
		},
	);
}
