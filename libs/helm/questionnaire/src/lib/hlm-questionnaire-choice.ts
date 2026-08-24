import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import {
	BrnQuestionnaireChoice,
	BrnQuestionnaireChoiceInput,
	BrnQuestionnaireChoiceLabel,
	BrnQuestionnaireChoiceShortcut,
} from '@spartan-ng/brain/questionnaire';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- attribute selector on native label
	selector: 'label[hlmQuestionnaireChoice]',
	exportAs: 'hlmQuestionnaireChoice',
	imports: [BrnQuestionnaireChoiceInput, BrnQuestionnaireChoiceLabel, BrnQuestionnaireChoiceShortcut, NgIcon],
	viewProviders: [provideIcons({ lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnQuestionnaireChoice,
			inputs: ['value', 'disabled', 'defaultChecked', 'checked'],
			outputs: ['checkedChange'],
		},
	],
	host: {
		'data-slot': 'questionnaire-choice',
	},
	template: `
		<input
			brnQuestionnaireChoiceInput
			data-slot="questionnaire-choice-input"
			class="spartan-questionnaire-choice-input absolute inset-0 z-10 size-full cursor-pointer opacity-0"
		/>
		<span aria-hidden="true" data-slot="questionnaire-choice-indicator" class="spartan-questionnaire-choice-indicator">
			@if (_choice.checked() && _choice.type() === 'radio') {
				<span data-slot="questionnaire-choice-indicator-dot" class="spartan-questionnaire-choice-indicator-dot"></span>
			}
			@if (_choice.checked() && _choice.type() === 'checkbox') {
				<ng-icon
					name="lucideCheck"
					data-slot="questionnaire-choice-indicator-check"
					class="spartan-questionnaire-choice-indicator-check"
				/>
			}
		</span>
		<span
			brnQuestionnaireChoiceLabel
			data-slot="questionnaire-choice-label"
			class="spartan-questionnaire-choice-label spartan-questionnaire-choice-content flex min-w-0 flex-1 flex-col leading-snug"
		>
			<ng-content />
		</span>
		@if (_choice.shortcut(); as shortcut) {
			<span
				brnQuestionnaireChoiceShortcut
				data-slot="questionnaire-choice-shortcut"
				class="spartan-questionnaire-choice-shortcut spartan-questionnaire-shortcut"
			>
				{{ shortcut }}
			</span>
		}
	`,
})
export class HlmQuestionnaireChoice {
	protected readonly _choice = inject(BrnQuestionnaireChoice);

	constructor() {
		classes(
			() =>
				'spartan-questionnaire-choice group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start text-start outline-none select-none',
		);
	}
}
