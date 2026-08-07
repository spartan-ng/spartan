import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnQuestionnaireProgress, type BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { formValue } from './questionnaire.shared';

@Component({
	selector: 'spartan-questionnaire-checkpoint-progress',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnQuestionnaireProgress }],
	host: {
		class: 'spartan-questionnaire-progress flex w-full min-w-0 flex-col',
		'data-slot': 'questionnaire-progress',
	},
	template: `
		<div class="mb-2 flex gap-1.5" aria-hidden="true">
			@for (filled of _segments(); track $index) {
				<span class="h-1.5 flex-1 rounded-full" [class]="filled ? 'bg-primary' : 'bg-muted'"></span>
			}
		</div>
		<span>Checkpoint {{ _progress.current() }} of {{ _progress.total() }}</span>
	`,
})
export class QuestionnaireCheckpointProgress {
	protected readonly _progress = inject(BrnQuestionnaireProgress);

	protected readonly _segments = computed(() => {
		const total = this._progress.total();
		const current = this._progress.current();
		return Array.from({ length: total }, (_, index) => index < current);
	});
}

@Component({
	selector: 'spartan-questionnaire-progress-preview',
	imports: [FormsModule, HlmQuestionnaireImports, QuestionnaireCheckpointProgress],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form hlmQuestionnaire class="mx-auto max-w-md" [items]="items" defaultItem="scope" (ngSubmit)="onSubmit($event)">
			<spartan-questionnaire-checkpoint-progress />

			<fieldset hlmQuestionnaireItem name="scope" required>
				<legend hlmQuestionnaireTitle>How large is the change?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="small">Small patch</label>
					<label hlmQuestionnaireChoice value="medium">Feature-sized change</label>
					<label hlmQuestionnaireChoice value="large">Cross-package change</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="strategy" required>
				<legend hlmQuestionnaireTitle>How should commits be organized?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="single">Single commit</label>
					<label hlmQuestionnaireChoice value="logical">Logical commits</label>
					<label hlmQuestionnaireChoice value="squash">Squash before review</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="tests" required>
				<legend hlmQuestionnaireTitle>Which tests should run?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="targeted">Targeted tests</label>
					<label hlmQuestionnaireChoice value="package">Package suite</label>
					<label hlmQuestionnaireChoice value="workspace">Full workspace</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="delivery" required>
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
	protected readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{ name: 'scope', required: true },
		{ name: 'strategy', required: true },
		{ name: 'tests', required: true },
		{ name: 'delivery', required: true },
	];

	protected onSubmit(event: Event): void {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		toast('Pull request plan ready', {
			description: `Scope: ${formValue(form, 'scope')} · Commits: ${formValue(form, 'strategy')} · Tests: ${formValue(form, 'tests')} · Delivery: ${formValue(form, 'delivery')}`,
		});
	}
}
