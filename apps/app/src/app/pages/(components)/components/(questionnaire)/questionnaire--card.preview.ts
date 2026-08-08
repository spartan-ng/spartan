import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { formValue } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-card-preview',
	imports: [FormsModule, HlmQuestionnaireImports, HlmCardImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form
			hlmQuestionnaire
			class="mx-auto max-w-md"
			[items]="items"
			defaultItem="task"
			shortcuts="numbers"
			(ngSubmit)="onSubmit($event)"
		>
			<hlm-card>
				<fieldset hlmQuestionnaireItem name="task" required aria-labelledby="task-title">
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

				<fieldset hlmQuestionnaireItem name="output" required aria-labelledby="output-title">
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

	protected onSubmit(event: Event): void {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		toast('Agent task created', {
			description: `Task: ${formValue(form, 'task')} · Handoff: ${formValue(form, 'output')}`,
		});
	}
}
