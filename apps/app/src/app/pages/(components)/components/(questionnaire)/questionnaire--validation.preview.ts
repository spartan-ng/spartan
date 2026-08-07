import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnQuestionnaireProgress, type BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { z } from 'zod';

const items: readonly BrnQuestionnaireItemDefinition[] = [
	{ name: 'detail', required: true },
	{ name: 'audience', required: true },
];

const questionnaireSchema = z
	.object({
		detail: z.enum(['summary', 'complete']),
		audience: z.enum(['team', 'public']),
	})
	.superRefine((answers, context) => {
		if (answers.audience === 'public' && answers.detail === 'summary') {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Public answers need enough context. Choose a complete answer.',
				path: ['detail'],
			});
		}
	});

type QuestionnaireItemName = keyof z.infer<typeof questionnaireSchema>;
type QuestionnaireErrors = Partial<Record<QuestionnaireItemName, string>>;

@Component({
	selector: 'spartan-questionnaire-validation-progress',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnQuestionnaireProgress }],
	host: {
		class: 'spartan-questionnaire-progress min-w-0',
		'data-slot': 'questionnaire-progress',
	},
	template: `
		{{ _progress.current() }} / {{ _progress.total() }}
	`,
})
export class QuestionnaireValidationProgress {
	protected readonly _progress = inject(BrnQuestionnaireProgress);
}

@Component({
	selector: 'spartan-questionnaire-validation-preview',
	imports: [FormsModule, HlmQuestionnaireImports, HlmCardImports, QuestionnaireValidationProgress],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full justify-center py-6',
	},
	template: `
		<form hlmQuestionnaire class="mx-auto max-w-md" [items]="items" [(item)]="item" (ngSubmit)="onSubmit($event)">
			<hlm-card class="w-full">
				<fieldset hlmQuestionnaireItem name="detail" required [invalid]="!!errors().detail">
					<hlm-card-header>
						<legend hlmQuestionnaireTitle>How much detail should the answer include?</legend>
						<p hlmQuestionnaireDescription>Choose the response depth.</p>
						<div hlmCardAction>
							<spartan-questionnaire-validation-progress />
						</div>
					</hlm-card-header>
					<div hlmCardContent>
						<div hlmQuestionnaireChoices>
							<label hlmQuestionnaireChoice value="summary" (checkedChange)="clearError('detail')">
								Concise summary
							</label>
							<label hlmQuestionnaireChoice value="complete" (checkedChange)="clearError('detail')">
								Complete answer
							</label>
						</div>
						<p hlmQuestionnaireError [message]="errors().detail"></p>
					</div>
				</fieldset>

				<fieldset hlmQuestionnaireItem name="audience" required [invalid]="!!errors().audience">
					<hlm-card-header>
						<legend hlmQuestionnaireTitle>Who will read the answer?</legend>
						<p hlmQuestionnaireDescription>Public answers require complete context.</p>
						<div hlmCardAction>
							<spartan-questionnaire-validation-progress />
						</div>
					</hlm-card-header>
					<div hlmCardContent>
						<div hlmQuestionnaireChoices>
							<label hlmQuestionnaireChoice value="team" (checkedChange)="clearError('audience')">My team</label>
							<label hlmQuestionnaireChoice value="public" (checkedChange)="clearError('audience')">
								Public audience
							</label>
						</div>
						<p hlmQuestionnaireError [message]="errors().audience"></p>
					</div>
				</fieldset>

				<hlm-card-footer>
					<div hlmQuestionnaireActions>
						<button hlmQuestionnairePrevious>Previous</button>
						<button hlmQuestionnaireNext>Next</button>
						<button hlmQuestionnaireSubmit>Validate answers</button>
					</div>
				</hlm-card-footer>
			</hlm-card>
		</form>
	`,
})
export class QuestionnaireValidationPreview {
	protected readonly items = items;
	protected readonly item = signal('detail');
	protected readonly errors = signal<QuestionnaireErrors>({});

	protected clearError(name: QuestionnaireItemName): void {
		this.errors.update((currentErrors) => {
			if (!currentErrors[name]) {
				return currentErrors;
			}
			const nextErrors = { ...currentErrors };
			delete nextErrors[name];
			return nextErrors;
		});
	}

	protected onSubmit(event: Event): void {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const result = questionnaireSchema.safeParse(Object.fromEntries(new FormData(form)));

		if (result.success) {
			this.errors.set({});
			toast('Agent response configured', {
				description: `Detail: ${result.data.detail} · Audience: ${result.data.audience}`,
			});
			return;
		}

		const nextErrors: QuestionnaireErrors = {};
		for (const issue of result.error.issues) {
			const name = issue.path[0];
			if ((name === 'detail' || name === 'audience') && !nextErrors[name]) {
				nextErrors[name] = issue.message;
			}
		}

		const firstInvalidItem = result.error.issues[0]?.path[0];
		this.errors.set(nextErrors);

		if (firstInvalidItem === 'detail' || firstInvalidItem === 'audience') {
			this.item.set(firstInvalidItem);
		}
	}
}
