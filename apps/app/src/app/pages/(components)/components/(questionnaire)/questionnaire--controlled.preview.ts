import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { formValue } from './questionnaire.shared';

const itemLabels: Record<string, string> = {
	scope: 'Change scope',
	checks: 'Verification',
	output: 'Final output',
};

@Component({
	selector: 'spartan-questionnaire-controlled-preview',
	imports: [FormsModule, HlmQuestionnaireImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'relative flex w-full justify-center py-6',
	},
	template: `
		<div class="relative mx-auto flex h-full w-full max-w-md flex-col">
			<p class="text-muted-foreground absolute end-0 top-0 text-sm" role="status">
				Current checkpoint: {{ currentLabel() }}
			</p>

			<form hlmQuestionnaire class="mt-auto" [items]="items" [(item)]="item" (ngSubmit)="onSubmit($event)">
				<div hlmQuestionnaireProgress></div>

				<fieldset hlmQuestionnaireItem name="scope" required>
					<legend hlmQuestionnaireTitle>What may the agent change?</legend>
					<p hlmQuestionnaireDescription>The host stores the active checkpoint while Questionnaire navigates.</p>
					<div hlmQuestionnaireChoices>
						<label hlmQuestionnaireChoice value="component">Only the target component</label>
						<label hlmQuestionnaireChoice value="tests">Component and related tests</label>
						<label hlmQuestionnaireChoice value="feature">The complete feature area</label>
					</div>
					<p hlmQuestionnaireError></p>
				</fieldset>

				<fieldset hlmQuestionnaireItem name="checks" required>
					<legend hlmQuestionnaireTitle>Which verification level should it use?</legend>
					<div hlmQuestionnaireChoices>
						<label hlmQuestionnaireChoice value="targeted">Targeted tests</label>
						<label hlmQuestionnaireChoice value="package">Package tests and typecheck</label>
						<label hlmQuestionnaireChoice value="full">Full workspace verification</label>
					</div>
					<p hlmQuestionnaireError></p>
				</fieldset>

				<fieldset hlmQuestionnaireItem name="output" required>
					<legend hlmQuestionnaireTitle>What should the agent return when finished?</legend>
					<div hlmQuestionnaireChoices>
						<label hlmQuestionnaireChoice value="summary">Concise summary</label>
						<label hlmQuestionnaireChoice value="diff">Summary with changed files</label>
						<label hlmQuestionnaireChoice value="handoff">Detailed implementation handoff</label>
					</div>
					<p hlmQuestionnaireError></p>
				</fieldset>

				<div hlmQuestionnaireActions>
					<button hlmQuestionnairePrevious>Previous</button>
					<button hlmQuestionnaireNext>Next</button>
					<button hlmQuestionnaireSubmit>Save workflow</button>
				</div>
			</form>
		</div>
	`,
})
export class QuestionnaireControlledPreview {
	public readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{ name: 'scope', required: true },
		{ name: 'checks', required: true },
		{ name: 'output', required: true },
	];

	public readonly item = signal('scope');
	public readonly currentLabel = computed(() => itemLabels[this.item()] ?? this.item());

	protected onSubmit(event: Event): void {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		toast('Agent workflow configured', {
			description: `Scope: ${formValue(form, 'scope')} · Verification: ${formValue(form, 'checks')} · Output: ${formValue(form, 'output')}`,
		});
	}
}
