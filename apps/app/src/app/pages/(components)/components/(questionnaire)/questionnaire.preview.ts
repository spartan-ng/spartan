import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { answerLabel } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-preview',
	imports: [FormRoot, FormField, HlmQuestionnaireImports],
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
			defaultItem="direction"
			shortcuts="letters"
		>
			<div hlmQuestionnaireProgress></div>

			<fieldset hlmQuestionnaireItem name="direction" required [formField]="form.direction">
				<legend hlmQuestionnaireTitle>What should the agent build next?</legend>
				<p hlmQuestionnaireDescription>Choose a direction or describe another task.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="tool-calls">
						<span class="font-medium">Tool call timeline</span>
						<span hlmQuestionnaireChoiceDescription>Show what the agent ran and what came back.</span>
					</label>
					<label hlmQuestionnaireChoice value="approvals">
						<span class="font-medium">Approval checkpoints</span>
						<span hlmQuestionnaireChoiceDescription>Ask before sensitive or destructive actions.</span>
					</label>
					<label hlmQuestionnaireChoice value="handoffs">
						<span class="font-medium">Sub-agent handoffs</span>
						<span hlmQuestionnaireChoiceDescription>Make delegated work and results easier to follow.</span>
					</label>
					<input hlmQuestionnaireInput aria-label="Another agent feature" placeholder="Describe another feature…" />
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="signals" multiple [formField]="form.signals">
				<legend hlmQuestionnaireTitle>What should every progress update include?</legend>
				<p hlmQuestionnaireDescription>Select all that apply, or skip this question.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="progress">Progress</label>
					<label hlmQuestionnaireChoice value="decisions">Decisions</label>
					<label hlmQuestionnaireChoice value="risks">Risks</label>
					<label hlmQuestionnaireChoice value="next-step">Next step</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="timing" required [formField]="form.timing">
				<legend hlmQuestionnaireTitle>When should work begin?</legend>
				<p hlmQuestionnaireDescription>Choose when the agent should begin the work.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="now">Start now</label>
					<label hlmQuestionnaireChoice value="next-cycle">Next development cycle</label>
					<label hlmQuestionnaireChoice value="backlog">Add it to the backlog</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<div hlmQuestionnaireActions>
				<button hlmQuestionnairePrevious>Previous</button>
				<button hlmQuestionnaireSkip>Skip</button>
				<button hlmQuestionnaireNext>Next</button>
				<button hlmQuestionnaireSubmit>Save plan</button>
			</div>
		</form>
	`,
})
export class QuestionnairePreview {
	public readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{
			name: 'direction',
			required: true,
			choices: [{ value: 'tool-calls' }, { value: 'approvals' }, { value: 'handoffs' }],
		},
		{
			name: 'signals',
			required: false,
			choices: [{ value: 'progress' }, { value: 'decisions' }, { value: 'risks' }, { value: 'next-step' }],
		},
		{
			name: 'timing',
			required: true,
			choices: [{ value: 'now' }, { value: 'next-cycle' }, { value: 'backlog' }],
		},
	];

	protected readonly _model = signal({
		direction: '',
		signals: [] as string[],
		timing: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.direction);
			required(schemaPath.timing);
		},
		{
			submission: {
				action: async () => {
					const answers = this._model();
					toast('Agent plan saved', {
						description: `Direction: ${answerLabel(answers.direction)} · Progress signals: ${answerLabel(answers.signals)} · Timing: ${answerLabel(answers.timing)}`,
					});
				},
			},
		},
	);
}

export const defaultImports = `
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
`;

export const defaultSkeleton = `
<form hlmQuestionnaire [formRoot]="form" class="mx-auto max-w-md" [items]="items" defaultItem="direction" shortcuts="letters">
  <div hlmQuestionnaireProgress></div>
  <fieldset hlmQuestionnaireItem name="direction" required [formField]="form.direction">
    <legend hlmQuestionnaireTitle>What should the agent build next?</legend>
    <p hlmQuestionnaireDescription>Choose a direction or describe another task.</p>
    <div hlmQuestionnaireChoices>
      <label hlmQuestionnaireChoice value="tool-calls">
        <span class="font-medium">Tool call timeline</span>
        <span hlmQuestionnaireChoiceDescription>Show what the agent ran and what came back.</span>
      </label>
      <input hlmQuestionnaireInput aria-label="Another agent feature" placeholder="Describe another feature…" />
    </div>
    <p hlmQuestionnaireError></p>
  </fieldset>
  <div hlmQuestionnaireActions>
    <button hlmQuestionnairePrevious>Previous</button>
    <button hlmQuestionnaireSkip>Skip</button>
    <button hlmQuestionnaireNext>Next</button>
    <button hlmQuestionnaireSubmit>Save plan</button>
  </div>
</form>
`;
