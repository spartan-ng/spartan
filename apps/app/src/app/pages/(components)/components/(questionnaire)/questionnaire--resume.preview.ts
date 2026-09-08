import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { answerLabel } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-resume-preview',
	imports: [FormRoot, FormField, HlmQuestionnaireImports, HlmButtonImports],
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
			defaultItem="verification"
			(reset)="onReset()"
		>
			<div hlmQuestionnaireProgress></div>

			<fieldset hlmQuestionnaireItem name="change" required [formField]="form.change">
				<legend hlmQuestionnaireTitle>What kind of migration is this?</legend>
				<p hlmQuestionnaireDescription>This answer was saved during the previous session.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="incremental" defaultChecked>Incremental migration</label>
					<label hlmQuestionnaireChoice value="cutover">Single cutover</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="verification" multiple required [formField]="form.verification">
				<legend hlmQuestionnaireTitle>How should the migration be verified?</legend>
				<p hlmQuestionnaireDescription>These checks were selected during the previous session.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="tests" defaultChecked>Run migration tests</label>
					<label hlmQuestionnaireChoice value="typecheck" defaultChecked>Run the typecheck</label>
					<label hlmQuestionnaireChoice value="manual">Perform a manual smoke test</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="notes" [formField]="form.notes">
				<legend hlmQuestionnaireTitle>Anything else the agent should remember?</legend>
				<p hlmQuestionnaireDescription>This note was saved with the draft.</p>
				<input
					hlmQuestionnaireInput
					aria-label="Saved migration note"
					[defaultValue]="noteDefault"
					[attr.defaultValue]="noteDefault"
				/>
			</fieldset>

			<div hlmQuestionnaireActions>
				<button hlmBtn type="reset" variant="outline">Reset changes</button>
				<button hlmQuestionnairePrevious>Previous</button>
				<button hlmQuestionnaireNext>Next</button>
				<button hlmQuestionnaireSubmit>Update draft</button>
			</div>
		</form>
	`,
})
export class QuestionnaireResumePreview {
	public readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{ name: 'change', required: true },
		{ name: 'verification', required: true },
		{ name: 'notes' },
	];

	public readonly noteDefault = 'Keep the existing public API stable.';

	protected readonly _model = signal({
		change: 'incremental',
		verification: ['tests', 'typecheck'] as string[],
		notes: 'Keep the existing public API stable.',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.change);
			required(schemaPath.verification);
		},
		{
			submission: {
				action: async () => {
					const answers = this._model();
					toast('Draft updated', {
						description: `Migration: ${answerLabel(answers.change)} · Verification: ${answerLabel(answers.verification)} · Notes: ${answerLabel(answers.notes)}`,
					});
				},
			},
		},
	);

	protected onReset(): void {
		toast('Saved answers restored');
	}
}
