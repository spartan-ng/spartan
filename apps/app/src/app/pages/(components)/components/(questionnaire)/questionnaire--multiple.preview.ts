import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { formValues } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-multiple-preview',
	imports: [FormsModule, HlmQuestionnaireImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form hlmQuestionnaire class="mx-auto max-w-md" [items]="items" shortcuts="letters" (ngSubmit)="onSubmit($event)">
			<fieldset hlmQuestionnaireItem name="context" multiple required>
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
	protected readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{
			name: 'context',
			required: true,
			choices: [{ value: 'source' }, { value: 'tests' }, { value: 'docs' }, { value: 'history' }],
		},
	];

	protected onSubmit(event: Event): void {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		toast('Context selected', {
			description: `Context: ${formValues(form, 'context')}`,
		});
	}
}
