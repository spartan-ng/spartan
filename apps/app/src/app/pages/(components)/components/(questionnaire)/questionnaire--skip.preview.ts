import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { formValue, type QuestionnaireItemStatus } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-skip-preview',
	imports: [FormsModule, HlmQuestionnaireImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form hlmQuestionnaire class="mx-auto max-w-md" [items]="items" defaultItem="task" (ngSubmit)="onSubmit($event)">
			<div hlmQuestionnaireProgress></div>

			<fieldset hlmQuestionnaireItem name="task" required>
				<legend hlmQuestionnaireTitle>What kind of change is this?</legend>
				<p hlmQuestionnaireDescription>Choose the category that best describes the work.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="feature">New feature</label>
					<label hlmQuestionnaireChoice value="fix">Bug fix</label>
					<label hlmQuestionnaireChoice value="refactor">Refactor</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="constraints" (statusChange)="onConstraintStatus($event)">
				<legend hlmQuestionnaireTitle>Are there any implementation constraints?</legend>
				<p hlmQuestionnaireDescription>Answer if needed, or intentionally skip this question.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="no-dependencies">Do not add dependencies</label>
					<label hlmQuestionnaireChoice value="no-migrations">Do not change the database</label>
					<label hlmQuestionnaireChoice value="preserve-api">Preserve the public API</label>
					<input
						hlmQuestionnaireInput
						aria-label="Another implementation constraint"
						placeholder="Describe another constraint…"
					/>
				</div>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="review" required>
				<legend hlmQuestionnaireTitle>How should the work be reviewed?</legend>
				<p hlmQuestionnaireDescription>Choose the checks the agent should complete before handoff.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="tests">Run the test suite</label>
					<label hlmQuestionnaireChoice value="diff">Review the final diff</label>
					<label hlmQuestionnaireChoice value="both">Tests and diff review</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<div hlmQuestionnaireActions>
				<button hlmQuestionnairePrevious>Previous</button>
				<button hlmQuestionnaireSkip>Skip</button>
				<button hlmQuestionnaireNext>Next</button>
				<button hlmQuestionnaireSubmit>Submit brief</button>
			</div>
		</form>
	`,
})
export class QuestionnaireSkipPreview {
	public readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{ name: 'task', required: true },
		{ name: 'constraints' },
		{ name: 'review', required: true },
	];

	private readonly _constraintStatus = signal<QuestionnaireItemStatus>('unanswered');

	protected onConstraintStatus(status: QuestionnaireItemStatus): void {
		this._constraintStatus.set(status);
	}

	protected onSubmit(event: Event): void {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const constraints = this._constraintStatus() === 'skipped' ? 'Skipped' : formValue(form, 'constraints');

		toast('Agent brief submitted', {
			description: `Task: ${formValue(form, 'task')} · Constraints: ${constraints} · Review: ${formValue(form, 'review')}`,
		});
	}
}
