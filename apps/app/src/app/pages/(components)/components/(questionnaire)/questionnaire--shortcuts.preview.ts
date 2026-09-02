import { ChangeDetectionStrategy, Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { answerLabel, type QuestionnaireShortcutMode } from './questionnaire.shared';

type ShortcutSelectValue = 'none' | 'letters' | 'numbers';

@Component({
	selector: 'spartan-questionnaire-shortcuts-preview',
	imports: [FormRoot, FormField, HlmQuestionnaireImports, HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'relative flex min-h-[350px] w-full flex-1 self-stretch justify-center py-6',
		// Clicking the preview (not the mode select) focuses the questionnaire so A/B/C keys work.
		'(pointerdown)': 'onPreviewPointerDown($event)',
	},
	template: `
		<div class="relative mx-auto flex h-full min-h-[300px] w-full max-w-md flex-col">
			<label class="sr-only" for="questionnaire-shortcut-style">Shortcut style</label>
			<hlm-select
				class="absolute end-0 top-0 z-10"
				[value]="shortcutsSelectValue()"
				[itemToString]="shortcutLabel"
				(valueChange)="onShortcutsChange($event)"
			>
				<hlm-select-trigger class="w-36" buttonId="questionnaire-shortcut-style">
					<hlm-select-value placeholder="Shortcuts" />
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						@for (option of shortcutOptions; track option.value) {
							<hlm-select-item [value]="option.value">{{ option.label }}</hlm-select-item>
						}
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select>

			<form
				#questionnaireForm
				hlmQuestionnaire
				class="mt-auto"
				[formRoot]="form"
				[items]="items"
				defaultItem="action"
				[shortcuts]="shortcuts()"
			>
				<fieldset hlmQuestionnaireItem name="action" required [formField]="form.action">
					<legend hlmQuestionnaireTitle>What should the agent do next?</legend>
					<p hlmQuestionnaireDescription>Use the displayed shortcut or navigate with the keyboard.</p>
					<div hlmQuestionnaireChoices>
						<label hlmQuestionnaireChoice value="inspect">Inspect the implementation</label>
						<label hlmQuestionnaireChoice value="tests">Run the relevant tests</label>
						<label hlmQuestionnaireChoice value="patch">Prepare the patch</label>
					</div>
					<p hlmQuestionnaireError></p>
				</fieldset>

				<div hlmQuestionnaireActions>
					<button hlmQuestionnaireSubmit>Confirm action</button>
				</div>
			</form>
		</div>
	`,
})
export class QuestionnaireShortcutsPreview {
	private readonly _questionnaireEl = viewChild<ElementRef<HTMLFormElement>>('questionnaireForm');

	public readonly items: readonly BrnQuestionnaireItemDefinition[] = [
		{
			name: 'action',
			required: true,
			choices: [{ value: 'inspect' }, { value: 'tests' }, { value: 'patch' }],
		},
	];

	public readonly shortcutOptions: readonly { value: ShortcutSelectValue; label: string }[] = [
		{ value: 'none', label: 'No shortcuts' },
		{ value: 'letters', label: 'Letters' },
		{ value: 'numbers', label: 'Numbers' },
	];

	public readonly shortcuts = signal<QuestionnaireShortcutMode>('letters');
	public readonly shortcutsSelectValue = computed<ShortcutSelectValue>(() => this.shortcuts() ?? 'none');

	protected readonly _model = signal({
		action: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.action);
		},
		{
			submission: {
				action: async () => {
					toast('Next action selected', {
						description: `Action: ${answerLabel(this._model().action)} · Shortcuts: ${this.shortcuts() ?? 'none'}`,
					});
				},
			},
		},
	);

	protected readonly shortcutLabel = (value: ShortcutSelectValue) =>
		this.shortcutOptions.find((option) => option.value === value)?.label ?? '';

	protected onShortcutsChange(value: ShortcutSelectValue | null | undefined): void {
		if (value === 'letters' || value === 'numbers') {
			this.shortcuts.set(value);
		} else {
			this.shortcuts.set(null);
		}

		// Return focus to the questionnaire so the next keypress is a shortcut, not lost on the select.
		queueMicrotask(() => this.focusQuestionnaire());
	}

	protected onPreviewPointerDown(event: PointerEvent): void {
		const target = event.target;
		if (!(target instanceof Element)) {
			return;
		}

		// Let the mode select keep focus while open / being used.
		if (target.closest('[data-slot="select"], [data-slot="select-trigger"], [data-slot="select-content"]')) {
			return;
		}

		this.focusQuestionnaire();
	}

	private focusQuestionnaire(): void {
		this._questionnaireEl()?.nativeElement.focus({ preventScroll: true });
	}
}
