import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { formValue, type QuestionnaireItemStatus } from './questionnaire.shared';

type ItemName = 'permission' | 'verification';

@Component({
	selector: 'spartan-questionnaire-navigation-state-preview',
	imports: [FormsModule, HlmQuestionnaireImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form hlmQuestionnaire class="mx-auto max-w-md" [items]="items" [(item)]="item" (ngSubmit)="onSubmit($event)">
			<div hlmQuestionnaireProgress></div>

			<fieldset hlmQuestionnaireItem name="permission" required (statusChange)="setStatus('permission', $event)">
				<legend hlmQuestionnaireTitle>What may the agent modify?</legend>
				<p hlmQuestionnaireDescription>Next is intentionally disabled until an answer is selected.</p>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="files">Project files</label>
					<label hlmQuestionnaireChoice value="tests">Project files and tests</label>
					<label hlmQuestionnaireChoice value="config">Files, tests, and configuration</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<fieldset hlmQuestionnaireItem name="verification" required (statusChange)="setStatus('verification', $event)">
				<legend hlmQuestionnaireTitle>What must pass before completion?</legend>
				<div hlmQuestionnaireChoices>
					<label hlmQuestionnaireChoice value="tests">Tests</label>
					<label hlmQuestionnaireChoice value="types">Tests and types</label>
					<label hlmQuestionnaireChoice value="all">Tests, types, and visual QA</label>
				</div>
				<p hlmQuestionnaireError></p>
			</fieldset>

			<div hlmQuestionnaireActions>
				<button hlmQuestionnairePrevious>Previous</button>
				<button
					hlmQuestionnaireNext
					variant="secondary"
					class="data-[status=unanswered]:opacity-50"
					[attr.data-status]="activeStatus()"
					[disabled]="unanswered()"
				>
					Next
				</button>
				<button hlmQuestionnaireSubmit [disabled]="unanswered()">Save permissions</button>
			</div>
		</form>
	`,
})
export class QuestionnaireNavigationStatePreview {
	protected readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{ name: 'permission', required: true },
		{ name: 'verification', required: true },
	];

	protected readonly item = signal<ItemName>('permission');
	private readonly _statuses = signal<Record<ItemName, QuestionnaireItemStatus>>({
		permission: 'unanswered',
		verification: 'unanswered',
	});

	protected readonly activeStatus = computed(() => this._statuses()[this.item()]);
	protected readonly unanswered = computed(() => this.activeStatus() === 'unanswered');

	protected setStatus(name: ItemName, status: QuestionnaireItemStatus): void {
		this._statuses.update((current) => ({ ...current, [name]: status }));
	}

	protected onSubmit(event: Event): void {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		toast('Permissions saved', {
			description: `Permission: ${formValue(form, 'permission')} · Verification: ${formValue(form, 'verification')}`,
		});
	}
}
