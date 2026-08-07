import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { formValue } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-freeform-preview',
	imports: [FormsModule, HlmQuestionnaireImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form hlmQuestionnaire class="mx-auto max-w-md" [items]="items" shortcuts="letters" (ngSubmit)="onSubmit($event)">
			<fieldset hlmQuestionnaireItem name="approach" required>
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
	protected readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{
			name: 'approach',
			required: true,
			choices: [{ value: 'incremental' }, { value: 'module' }, { value: 'rewrite' }],
		},
	];

	protected onSubmit(event: Event): void {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		toast('Approach selected', {
			description: `Approach: ${formValue(form, 'approach')}`,
		});
	}
}
