import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { formValue } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-conditional-preview',
	imports: [FormsModule, HlmQuestionnaireImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form
			hlmQuestionnaire
			class="mx-auto max-w-md"
			[items]="items()"
			defaultItem="runtime"
			(ngSubmit)="onSubmit($event)"
		>
			<div hlmQuestionnaireProgress></div>

			<fieldset hlmQuestionnaireItem name="runtime" required>
				<legend hlmQuestionnaireTitle>Where should the agent run?</legend>
				<p hlmQuestionnaireDescription>Cloud runs add an environment question to this flow.</p>
				<div hlmQuestionnaireChoices>
					<label
						hlmQuestionnaireChoice
						value="local"
						[checked]="runtime() === 'local'"
						(checkedChange)="setRuntime('local', $event)"
					>
						Local workspace
					</label>
					<label
						hlmQuestionnaireChoice
						value="cloud"
						[checked]="runtime() === 'cloud'"
						(checkedChange)="setRuntime('cloud', $event)"
					>
						Cloud workspace
					</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="environment" required [disabled]="runtime() !== 'cloud'">
				<legend hlmQuestionnaireTitle>Which cloud environment should it use?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="preview">Preview</label>
					<label hlmQuestionnaireChoice value="staging">Staging</label>
					<label hlmQuestionnaireChoice value="isolated">Isolated sandbox</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="approval" required>
				<legend hlmQuestionnaireTitle>When should the agent request approval?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="writes">Before writing files</label>
					<label hlmQuestionnaireChoice value="commands">Before running commands</label>
					<label hlmQuestionnaireChoice value="sensitive">Only for sensitive actions</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<div hlmQuestionnaireActions>
				<button hlmQuestionnairePrevious>Previous</button>
				<button hlmQuestionnaireNext>Next</button>
				<button hlmQuestionnaireSubmit>Save execution plan</button>
			</div>
		</form>
	`,
})
export class QuestionnaireConditionalPreview {
	public readonly runtime = signal('local');

	public readonly items = computed(() => [
		{ name: 'runtime', required: true },
		{
			name: 'environment',
			required: true,
			disabled: this.runtime() !== 'cloud',
		},
		{ name: 'approval', required: true },
	]);

	protected setRuntime(value: string, event: Event): void {
		const target = event.target;
		if (!(target instanceof HTMLInputElement) || !target.checked) {
			return;
		}
		this.runtime.set(value);
	}

	protected onSubmit(event: Event): void {
		event.preventDefault();
		const form = event.target as HTMLFormElement;

		toast('Execution plan saved', {
			description: `Runtime: ${formValue(form, 'runtime')} · Environment: ${formValue(form, 'environment', 'Not applicable')} · Approval: ${formValue(form, 'approval')}`,
		});
	}
}
