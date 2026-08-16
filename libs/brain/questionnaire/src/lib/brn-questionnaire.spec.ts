import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnQuestionnaireImports } from '../index';
import { BrnQuestionnaireItem } from './brn-questionnaire-item';
import { getShortcutFromKey, getShortcutKeys, hasInputValue, isTextEntryTarget } from './brn-questionnaire.utils';

describe('BrnQuestionnaire', () => {
	const items = [
		{
			name: 'color',
			required: true,
			choices: [{ value: 'red' }, { value: 'blue' }],
		},
		{
			name: 'size',
			required: false,
			choices: [{ value: 's' }, { value: 'm' }],
		},
		{
			name: 'finish',
			required: true,
			choices: [{ value: 'matte' }, { value: 'gloss' }],
		},
	] as const;

	async function setup(template: string, componentProperties: Record<string, unknown> = {}) {
		const view = await render(template, {
			imports: [...BrnQuestionnaireImports],
			componentProperties: { items, ...componentProperties },
		});
		view.detectChanges();
		return { user: userEvent.setup(), view };
	}

	const baseTemplate = `
		<form
			brnQuestionnaire
			[items]="items"
			defaultItem="color"
			shortcuts="letters"
			data-testid="form"
			(submit)="$event.preventDefault()"
		>
			<div brnQuestionnaireProgress data-testid="progress"></div>

			<fieldset brnQuestionnaireItem name="color" required data-testid="item-color">
				<legend brnQuestionnaireTitle>Color</legend>
				<div brnQuestionnaireChoices>
					<label brnQuestionnaireChoice value="red">
						<input brnQuestionnaireChoiceInput />
						<span brnQuestionnaireChoiceLabel>Red</span>
						<span brnQuestionnaireChoiceShortcut></span>
					</label>
					<label brnQuestionnaireChoice value="blue">
						<input brnQuestionnaireChoiceInput />
						<span brnQuestionnaireChoiceLabel>Blue</span>
						<span brnQuestionnaireChoiceShortcut></span>
					</label>
				</div>
				<p brnQuestionnaireError data-testid="error-color"></p>
			</fieldset>

			<fieldset brnQuestionnaireItem name="size" data-testid="item-size">
				<legend brnQuestionnaireTitle>Size</legend>
				<div brnQuestionnaireChoices>
					<label brnQuestionnaireChoice value="s">
						<input brnQuestionnaireChoiceInput />
						<span brnQuestionnaireChoiceLabel>S</span>
					</label>
					<label brnQuestionnaireChoice value="m">
						<input brnQuestionnaireChoiceInput />
						<span brnQuestionnaireChoiceLabel>M</span>
					</label>
				</div>
			</fieldset>

			<fieldset brnQuestionnaireItem name="finish" required data-testid="item-finish">
				<legend brnQuestionnaireTitle>Finish</legend>
				<div brnQuestionnaireChoices>
					<label brnQuestionnaireChoice value="matte">
						<input brnQuestionnaireChoiceInput />
						<span brnQuestionnaireChoiceLabel>Matte</span>
					</label>
					<label brnQuestionnaireChoice value="gloss">
						<input brnQuestionnaireChoiceInput />
						<span brnQuestionnaireChoiceLabel>Gloss</span>
					</label>
				</div>
				<p brnQuestionnaireError data-testid="error-finish"></p>
			</fieldset>

			<button brnQuestionnairePrevious data-testid="previous">Previous</button>
			<button brnQuestionnaireSkip data-testid="skip">Skip</button>
			<button brnQuestionnaireNext data-testid="next">Next</button>
			<button brnQuestionnaireSubmit data-testid="submit">Submit</button>
			<button type="reset" data-testid="reset">Reset</button>
		</form>
	`;

	it('shows the first item and navigates forward after answering', async () => {
		const { user } = await setup(baseTemplate);

		expect(screen.getByTestId('item-color').hasAttribute('hidden')).toBe(false);
		expect(screen.getByTestId('item-size').hasAttribute('hidden')).toBe(true);
		expect(screen.getByTestId('next').hasAttribute('hidden')).toBe(false);
		expect(screen.getByTestId('submit').hasAttribute('hidden')).toBe(true);

		await user.click(screen.getByLabelText('Red'));
		await user.click(screen.getByTestId('next'));

		expect(screen.getByTestId('item-color').hasAttribute('hidden')).toBe(true);
		expect(screen.getByTestId('item-size').hasAttribute('hidden')).toBe(false);
	});

	it('blocks next when a required item is unanswered', async () => {
		const { user } = await setup(baseTemplate);

		await user.click(screen.getByTestId('next'));

		expect(screen.getByTestId('item-color').hasAttribute('hidden')).toBe(false);
		expect(screen.getByTestId('error-color').hasAttribute('hidden')).toBe(false);
		expect(screen.getByTestId('error-color').getAttribute('role')).toBe('alert');
	});

	it('allows skipping optional items', async () => {
		const { user } = await setup(baseTemplate);

		await user.click(screen.getByLabelText('Blue'));
		await user.click(screen.getByTestId('next'));

		expect(screen.getByTestId('skip').hasAttribute('hidden')).toBe(false);
		await user.click(screen.getByTestId('skip'));

		expect(screen.getByTestId('item-finish').hasAttribute('hidden')).toBe(false);
		expect(screen.getByTestId('submit').hasAttribute('hidden')).toBe(false);
	});

	it('navigates back with previous', async () => {
		const { user } = await setup(baseTemplate);

		await user.click(screen.getByLabelText('Red'));
		await user.click(screen.getByTestId('next'));
		expect(screen.getByTestId('item-size').hasAttribute('hidden')).toBe(false);

		await user.click(screen.getByTestId('previous'));

		expect(screen.getByTestId('item-color').hasAttribute('hidden')).toBe(false);
		expect(screen.getByTestId('item-size').hasAttribute('hidden')).toBe(true);
	});

	it('blocks submit and jumps to the first unanswered required item', async () => {
		const { user } = await setup(baseTemplate);

		await user.click(screen.getByLabelText('Red'));
		await user.click(screen.getByTestId('next'));
		await user.click(screen.getByTestId('skip'));

		expect(screen.getByTestId('item-finish').hasAttribute('hidden')).toBe(false);
		await user.click(screen.getByTestId('submit'));

		expect(screen.getByTestId('item-finish').hasAttribute('hidden')).toBe(false);
		expect(screen.getByTestId('error-finish').hasAttribute('hidden')).toBe(false);
	});

	it('supports multiple selection', async () => {
		const multipleTemplate = `
			<form brnQuestionnaire [items]="items" defaultItem="tags">
				<fieldset brnQuestionnaireItem name="tags" multiple>
					<legend brnQuestionnaireTitle>Tags</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="a">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>A</span>
						</label>
						<label brnQuestionnaireChoice value="b">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>B</span>
						</label>
					</div>
				</fieldset>
				<button brnQuestionnaireSubmit>Submit</button>
			</form>
		`;

		const view = await render(multipleTemplate, {
			imports: [...BrnQuestionnaireImports],
			componentProperties: {
				items: [{ name: 'tags', choices: [{ value: 'a' }, { value: 'b' }] }],
			},
		});
		view.detectChanges();
		const user = userEvent.setup();

		const a = screen.getByLabelText('A') as HTMLInputElement;
		const b = screen.getByLabelText('B') as HTMLInputElement;

		expect(a.type).toBe('checkbox');
		await user.click(a);
		await user.click(b);
		expect(a.checked).toBe(true);
		expect(b.checked).toBe(true);
	});

	it('selects a choice via letter shortcut', async () => {
		const { view } = await setup(baseTemplate);
		const form = screen.getByTestId('form');
		const blue = screen.getByLabelText('Blue') as HTMLInputElement;

		form.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true, cancelable: true }));
		view.detectChanges();

		expect(blue.checked).toBe(true);
	});

	it('selects a choice via number shortcut', async () => {
		const numbersTemplate = `
			<form brnQuestionnaire [items]="items" defaultItem="color" shortcuts="numbers" data-testid="form">
				<fieldset brnQuestionnaireItem name="color" required>
					<legend brnQuestionnaireTitle>Color</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="red">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Red</span>
							<span brnQuestionnaireChoiceShortcut></span>
						</label>
						<label brnQuestionnaireChoice value="blue">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Blue</span>
							<span brnQuestionnaireChoiceShortcut></span>
						</label>
					</div>
				</fieldset>
			</form>
		`;

		const { view } = await setup(numbersTemplate, {
			items: [{ name: 'color', required: true, choices: [{ value: 'red' }, { value: 'blue' }] }],
		});
		const form = screen.getByTestId('form');
		const blue = screen.getByLabelText('Blue') as HTMLInputElement;

		form.dispatchEvent(new KeyboardEvent('keydown', { key: '2', bubbles: true, cancelable: true }));
		view.detectChanges();

		expect(blue.checked).toBe(true);
	});

	it('confirms the current answered item with Enter', async () => {
		const { user, view } = await setup(baseTemplate);
		const red = screen.getByLabelText('Red') as HTMLInputElement;

		await user.click(red);
		expect(red.checked).toBe(true);

		red.focus();
		// Enter must target the answered control so getAnswerByElement can resolve it.
		red.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
		view.detectChanges();

		expect(screen.getByTestId('item-size').hasAttribute('hidden')).toBe(false);
	});

	it('advances after answering with a freeform input', async () => {
		const freeformTemplate = `
			<form brnQuestionnaire [items]="items" defaultItem="notes" data-testid="form">
				<fieldset brnQuestionnaireItem name="notes" required data-testid="item-notes">
					<legend brnQuestionnaireTitle>Notes</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="none">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>None</span>
						</label>
						<input brnQuestionnaireInput aria-label="Custom note" data-testid="note-input" />
					</div>
					<p brnQuestionnaireError data-testid="error-notes"></p>
				</fieldset>
				<fieldset brnQuestionnaireItem name="done" required data-testid="item-done">
					<legend brnQuestionnaireTitle>Done</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="yes">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Yes</span>
						</label>
					</div>
				</fieldset>
				<button brnQuestionnaireNext data-testid="next">Next</button>
			</form>
		`;

		const { user } = await setup(freeformTemplate, {
			items: [
				{ name: 'notes', required: true, choices: [{ value: 'none' }] },
				{ name: 'done', required: true, choices: [{ value: 'yes' }] },
			],
		});

		await user.click(screen.getByTestId('next'));
		expect(screen.getByTestId('item-notes').hasAttribute('hidden')).toBe(false);
		expect(screen.getByTestId('error-notes').hasAttribute('hidden')).toBe(false);

		await user.type(screen.getByTestId('note-input'), 'Ship it');
		await user.click(screen.getByTestId('next'));

		expect(screen.getByTestId('item-done').hasAttribute('hidden')).toBe(false);
	});

	it('honors external invalid state on an item', async () => {
		const invalidTemplate = `
			<form brnQuestionnaire [items]="items" defaultItem="color">
				<fieldset brnQuestionnaireItem name="color" required [itemInvalid]="forceInvalid" data-testid="item-color">
					<legend brnQuestionnaireTitle>Color</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="red">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Red</span>
						</label>
					</div>
					<p brnQuestionnaireError data-testid="error-color"></p>
				</fieldset>
			</form>
		`;

		const { view } = await setup(invalidTemplate, {
			items: [{ name: 'color', required: true, choices: [{ value: 'red' }] }],
			forceInvalid: true,
		});

		expect(screen.getByTestId('error-color').hasAttribute('hidden')).toBe(false);
		expect(screen.getByTestId('item-color').getAttribute('aria-invalid')).toBe('true');

		view.rerender({
			imports: [...BrnQuestionnaireImports],
			componentProperties: {
				items: [{ name: 'color', required: true, choices: [{ value: 'red' }] }],
				forceInvalid: false,
			},
		});
		view.detectChanges();

		expect(screen.getByTestId('error-color').hasAttribute('hidden')).toBe(true);
	});

	it('exposes progress state for the active question', async () => {
		const { user } = await setup(baseTemplate);
		const progress = screen.getByTestId('progress');

		expect(progress.getAttribute('role')).toBe('progressbar');
		expect(progress.getAttribute('aria-valuenow')).toBe('1');
		expect(progress.getAttribute('aria-valuemax')).toBe('3');
		expect(progress.getAttribute('aria-valuetext')).toBe('Question 1 of 3');

		await user.click(screen.getByLabelText('Red'));
		await user.click(screen.getByTestId('next'));

		expect(progress.getAttribute('aria-valuenow')).toBe('2');
		expect(progress.getAttribute('aria-valuetext')).toBe('Question 2 of 3');
	});

	it('recovers when the active definition has no rendered item', async () => {
		const view = await render(
			`
			<form brnQuestionnaire [items]="items" defaultItem="missing" data-testid="form">
				<fieldset brnQuestionnaireItem name="color" required data-testid="item-color">
					<legend brnQuestionnaireTitle>Color</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="red">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Red</span>
						</label>
					</div>
				</fieldset>
				<button type="button" brnQuestionnaireNext data-testid="next">Next</button>
			</form>
			`,
			{
				imports: [...BrnQuestionnaireImports],
				componentProperties: {
					items: [
						{ name: 'missing', required: true, choices: [{ value: 'x' }] },
						{ name: 'color', required: true, choices: [{ value: 'red' }] },
					],
				},
			},
		);
		view.detectChanges();

		expect(screen.getByTestId('item-color').hidden).toBe(false);
		expect(screen.getByTestId('next')).not.toBeDisabled();
	});

	it('supports controlled item binding', async () => {
		const view = await render(
			`
			<form brnQuestionnaire [items]="items" [(item)]="active">
				<fieldset brnQuestionnaireItem name="color" required>
					<legend brnQuestionnaireTitle>Color</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="red">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Red</span>
						</label>
					</div>
				</fieldset>
				<fieldset brnQuestionnaireItem name="size">
					<legend brnQuestionnaireTitle>Size</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="s">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>S</span>
						</label>
					</div>
				</fieldset>
				<button type="button" data-testid="jump" (click)="active = 'size'">Jump</button>
			</form>
			`,
			{
				imports: [...BrnQuestionnaireImports],
				componentProperties: {
					active: 'color' as string | null,
					items: [
						{ name: 'color', required: true, choices: [{ value: 'red' }] },
						{ name: 'size', choices: [{ value: 's' }] },
					],
				},
			},
		);
		view.detectChanges();
		const user = userEvent.setup();

		await user.click(screen.getByTestId('jump'));
		view.detectChanges();

		expect(screen.getByText('Size').closest('fieldset')?.hasAttribute('hidden')).toBe(false);
	});

	it('excludes disabled items from navigation', async () => {
		const view = await render(
			`
			<form brnQuestionnaire [items]="items" defaultItem="a">
				<fieldset brnQuestionnaireItem name="a" required>
					<legend brnQuestionnaireTitle>A</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="1">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>One</span>
						</label>
					</div>
				</fieldset>
				<fieldset brnQuestionnaireItem name="b" disabled>
					<legend brnQuestionnaireTitle>B</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="2">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Two</span>
						</label>
					</div>
				</fieldset>
				<fieldset brnQuestionnaireItem name="c" required>
					<legend brnQuestionnaireTitle>C</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="3">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Three</span>
						</label>
					</div>
				</fieldset>
				<button brnQuestionnaireNext data-testid="next">Next</button>
				<button brnQuestionnaireSubmit data-testid="submit">Submit</button>
			</form>
			`,
			{
				imports: [...BrnQuestionnaireImports],
				componentProperties: {
					items: [
						{ name: 'a', required: true, choices: [{ value: '1' }] },
						{ name: 'b', disabled: true, choices: [{ value: '2' }] },
						{ name: 'c', required: true, choices: [{ value: '3' }] },
					],
				},
			},
		);
		view.detectChanges();
		const user = userEvent.setup();

		await user.click(screen.getByLabelText('One'));
		await user.click(screen.getByTestId('next'));

		expect(screen.getByText('C').closest('fieldset')?.hasAttribute('hidden')).toBe(false);
		expect(screen.getByTestId('submit').hasAttribute('hidden')).toBe(false);
	});

	it('resets answers and returns to the default item', async () => {
		const { user, view } = await setup(baseTemplate);

		await user.click(screen.getByLabelText('Red'));
		await user.click(screen.getByTestId('next'));
		expect(screen.getByTestId('item-size').hasAttribute('hidden')).toBe(false);

		await user.click(screen.getByTestId('reset'));
		view.detectChanges();

		expect(screen.getByTestId('item-color').hasAttribute('hidden')).toBe(false);
		expect((screen.getByLabelText('Red') as HTMLInputElement).checked).toBe(false);
	});

	it('assigns letter shortcuts from DOM order when items omit choices', async () => {
		const template = `
			<form brnQuestionnaire [items]="items" defaultItem="color" shortcuts="letters" data-testid="form">
				<fieldset brnQuestionnaireItem name="color" required>
					<legend brnQuestionnaireTitle>Color</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="red">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Red</span>
							<span brnQuestionnaireChoiceShortcut></span>
						</label>
						<label brnQuestionnaireChoice value="blue">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Blue</span>
							<span brnQuestionnaireChoiceShortcut></span>
						</label>
					</div>
				</fieldset>
			</form>
		`;

		const { view } = await setup(template, {
			items: [{ name: 'color', required: true }],
		});
		const form = screen.getByTestId('form');
		const blue = screen.getByLabelText('Blue') as HTMLInputElement;

		form.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true, cancelable: true }));
		view.detectChanges();

		expect(blue.checked).toBe(true);
	});
});

describe('BrnQuestionnaireItem ControlValueAccessor', () => {
	@Component({
		imports: [...BrnQuestionnaireImports],
		changeDetection: ChangeDetectionStrategy.OnPush,
		template: `
			<form brnQuestionnaire [items]="items" defaultItem="color">
				<fieldset brnQuestionnaireItem name="color" required #colorItem="brnQuestionnaireItem">
					<legend brnQuestionnaireTitle>Color</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="red">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Red</span>
						</label>
						<label brnQuestionnaireChoice value="blue">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Blue</span>
						</label>
						<input brnQuestionnaireInput aria-label="Custom color" data-testid="color-input" />
					</div>
				</fieldset>
				<fieldset brnQuestionnaireItem name="tags" multiple #tagsItem="brnQuestionnaireItem">
					<legend brnQuestionnaireTitle>Tags</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="a">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>A</span>
						</label>
						<label brnQuestionnaireChoice value="b">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>B</span>
						</label>
					</div>
				</fieldset>
			</form>
		`,
	})
	class QuestionnaireCvaHost {
		public readonly colorItem = viewChild.required<BrnQuestionnaireItem>('colorItem');
		public readonly tagsItem = viewChild.required<BrnQuestionnaireItem>('tagsItem');
		public readonly items = [
			{ name: 'color', required: true, choices: [{ value: 'red' }, { value: 'blue' }] },
			{ name: 'tags', choices: [{ value: 'a' }, { value: 'b' }] },
		];
	}

	async function setupCva() {
		const view = await render(QuestionnaireCvaHost);
		view.detectChanges();
		return { user: userEvent.setup(), view, host: view.fixture.componentInstance };
	}

	it('writes a single-select value onto the matching choice', async () => {
		const { view, host } = await setupCva();

		host.colorItem().writeValue('blue');
		view.detectChanges();

		expect((screen.getByLabelText('Blue') as HTMLInputElement).checked).toBe(true);
		expect((screen.getByLabelText('Red') as HTMLInputElement).checked).toBe(false);
	});

	it('emits the selected choice value on change', async () => {
		const { user, host } = await setupCva();
		const onChange = vi.fn();
		host.colorItem().registerOnChange(onChange);

		await user.click(screen.getByLabelText('Red'));

		expect(onChange).toHaveBeenCalledWith('red');
	});

	it('writes and emits multiple-select values as arrays', async () => {
		const { user, view, host } = await setupCva();
		const onChange = vi.fn();
		host.tagsItem().registerOnChange(onChange);

		host.tagsItem().writeValue(['a', 'b']);
		view.detectChanges();

		expect((screen.getByLabelText('A') as HTMLInputElement).checked).toBe(true);
		expect((screen.getByLabelText('B') as HTMLInputElement).checked).toBe(true);

		await user.click(screen.getByLabelText('A'));
		expect(onChange).toHaveBeenCalledWith(['b']);
	});

	it('writes a freeform value when it does not match a choice', async () => {
		const { view, host } = await setupCva();

		host.colorItem().writeValue('periwinkle');
		view.detectChanges();

		expect((screen.getByTestId('color-input') as HTMLInputElement).value).toBe('periwinkle');
		expect((screen.getByLabelText('Red') as HTMLInputElement).checked).toBe(false);
		expect((screen.getByLabelText('Blue') as HTMLInputElement).checked).toBe(false);
	});

	it('emits typed freeform text', async () => {
		const { user, host } = await setupCva();
		const onChange = vi.fn();
		host.colorItem().registerOnChange(onChange);

		await user.type(screen.getByTestId('color-input'), 'teal');

		expect(onChange).toHaveBeenLastCalledWith('teal');
	});
});

describe('BrnQuestionnaireItem Signal Forms', () => {
	@Component({
		imports: [...BrnQuestionnaireImports, FormField, FormRoot],
		changeDetection: ChangeDetectionStrategy.OnPush,
		template: `
			<form brnQuestionnaire [formRoot]="form" [items]="items" defaultItem="color">
				<fieldset
					brnQuestionnaireItem
					name="color"
					required
					[formField]="form.color"
					#colorItem="brnQuestionnaireItem"
					data-testid="item-color"
				>
					<legend brnQuestionnaireTitle>Color</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="red">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Red</span>
						</label>
						<label brnQuestionnaireChoice value="blue">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>Blue</span>
						</label>
					</div>
				</fieldset>
				<fieldset brnQuestionnaireItem name="size" [formField]="form.size" data-testid="item-size">
					<legend brnQuestionnaireTitle>Size</legend>
					<div brnQuestionnaireChoices>
						<label brnQuestionnaireChoice value="s">
							<input brnQuestionnaireChoiceInput />
							<span brnQuestionnaireChoiceLabel>S</span>
						</label>
					</div>
				</fieldset>
				<button brnQuestionnaireNext data-testid="next">Next</button>
			</form>
		`,
	})
	class QuestionnaireFormFieldHost {
		public readonly colorItem = viewChild.required<BrnQuestionnaireItem>('colorItem');
		public readonly items = [
			{ name: 'color', required: true, choices: [{ value: 'red' }, { value: 'blue' }] },
			{ name: 'size', choices: [{ value: 's' }] },
		];

		private readonly _model = signal({
			color: '',
			size: '',
		});

		public readonly form = form(this._model);
	}

	async function setupFormField() {
		const view = await render(QuestionnaireFormFieldHost);
		view.detectChanges();
		return { user: userEvent.setup(), view, host: view.fixture.componentInstance };
	}

	it('keeps the active item visible when bound with [formField]', async () => {
		await setupFormField();

		expect(screen.getByTestId('item-color').hasAttribute('hidden')).toBe(false);
		expect(screen.getByTestId('item-size').hasAttribute('hidden')).toBe(true);
		expect(screen.getByTestId('item-color').getAttribute('name')).toBe('color');
	});

	it('writes the selected choice into the signal model', async () => {
		const { user, host } = await setupFormField();

		await user.click(screen.getByLabelText('Red'));

		expect(host.form.color().value()).toBe('red');
	});

	it('does not hide the active item when the form control is disabled', async () => {
		const { view, host } = await setupFormField();

		host.colorItem().setDisabledState(true);
		view.detectChanges();

		expect(screen.getByTestId('item-color').hasAttribute('hidden')).toBe(false);
	});
});

describe('brn-questionnaire.utils', () => {
	it('maps shortcut modes to keys', () => {
		expect(getShortcutKeys('letters').slice(0, 3)).toEqual(['A', 'B', 'C']);
		expect(getShortcutKeys('numbers').slice(0, 3)).toEqual(['1', '2', '3']);
		expect(getShortcutKeys(null)).toEqual([]);
	});

	it('normalizes shortcut key lookup', () => {
		expect(getShortcutFromKey('b', 'letters')).toBe('B');
		expect(getShortcutFromKey('2', 'numbers')).toBe('2');
		expect(getShortcutFromKey('z', 'numbers')).toBeNull();
	});

	it('detects filled input values', () => {
		expect(hasInputValue('ship')).toBe(true);
		expect(hasInputValue('  ')).toBe(false);
		expect(hasInputValue(['a', ''])).toBe(true);
		expect(hasInputValue([])).toBe(false);
	});

	it('treats text controls as text-entry targets', () => {
		const input = document.createElement('input');
		input.type = 'text';
		expect(isTextEntryTarget(input)).toBe(true);

		const radio = document.createElement('input');
		radio.type = 'radio';
		expect(isTextEntryTarget(radio)).toBe(false);

		expect(isTextEntryTarget(document.createElement('select'))).toBe(true);
	});
});
