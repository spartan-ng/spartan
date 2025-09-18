import { createEvent, fireEvent, render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnAccordion, BrnAccordionItem, BrnAccordionTrigger } from './brn-accordion';

describe('BrnAccordionDirective', () => {
	const setup = async () => {
		const container = await render(
			`
      <div brnAccordion aria-label="acco">
        <div brnAccordionItem>
          <button brnAccordionTrigger aria-label="trigger">
            Is it accessible?
          </button>
          asdf
        </div>
        <div brnAccordionItem>
          <button brnAccordionTrigger aria-label="trigger">
            Is it styled?
          </button>
            Yes. It comes with default styles that match the other components' aesthetics.
        </div>
        <div brnAccordionItem>
          <button brnAccordionTrigger aria-label="trigger">
            Is it animated?
          </button>
            Yes. It's animated by default, but you can disable it if you prefer.
        </div>
      </div>
    `,
			{
				imports: [BrnAccordion, BrnAccordionItem, BrnAccordionTrigger],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			triggers: screen.getAllByLabelText('trigger'),
			accordion: screen.getByLabelText('acco'),
		};
	};
	const setupMulti = async () => {
		const container = await render(
			`
      <div brnAccordion type="multiple" orientation="horizontal" aria-label="acco">
        <div brnAccordionItem>
          <button brnAccordionTrigger aria-label="trigger">
            Is it accessible?
          </button>
          asdf
        </div>
        <div brnAccordionItem>
          <button brnAccordionTrigger aria-label="trigger">
            Is it styled?
          </button>
            Yes. It comes with default styles that match the other components' aesthetics.
        </div>
        <div brnAccordionItem>
          <button brnAccordionTrigger aria-label="trigger">
            Is it animated?
          </button>
            Yes. It's animated by default, but you can disable it if you prefer.
        </div>
      </div>
    `,
			{
				imports: [BrnAccordion, BrnAccordionItem, BrnAccordionTrigger],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			triggers: screen.getAllByLabelText('trigger'),
			accordion: screen.getByLabelText('acco'),
		};
	};
	const setupWithInput = async () => {
		const container = await render(
			`
      <div brnAccordion aria-label="acco">
        <div brnAccordionItem>
          <button brnAccordionTrigger aria-label="trigger">
           	Enter your name
          </button>

          <input data-testid="accordion-input" />
        </div>
      </div>
    `,
			{
				imports: [BrnAccordion, BrnAccordionItem, BrnAccordionTrigger],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			trigger: screen.getByLabelText('trigger'),
			accordion: screen.getByLabelText('acco'),
			input: screen.getByTestId('accordion-input'),
		};
	};

	const setupWithTextarea = async () => {
		const container = await render(
			`
      <div brnAccordion aria-label="acco">
        <div brnAccordionItem>
          <button brnAccordionTrigger aria-label="trigger">
            Enter description
          </button>
          <textarea data-testid="accordion-textarea"></textarea>
        </div>
      </div>
    `,
			{
				imports: [BrnAccordion, BrnAccordionItem, BrnAccordionTrigger],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			trigger: screen.getByLabelText('trigger'),
			accordion: screen.getByLabelText('acco'),
			textarea: screen.getByTestId('accordion-textarea'),
		};
	};

	const validateOpenClosed = async (triggers: HTMLElement[], accordion: HTMLElement, openedTriggers: boolean[]) => {
		await waitFor(() => {
			expect(triggers[0]).toHaveAttribute('data-state', openedTriggers[0] ? 'open' : 'closed');
			expect(triggers[1]).toHaveAttribute('data-state', openedTriggers[1] ? 'open' : 'closed');
			expect(triggers[2]).toHaveAttribute('data-state', openedTriggers[2] ? 'open' : 'closed');
			const anyOpen = openedTriggers.some((t) => t);
			expect(accordion).toHaveAttribute('data-state', anyOpen ? 'open' : 'closed');
		});
	};

	describe('single accordion', () => {
		it('initial state all datastate closed', async () => {
			const { triggers, accordion } = await setup();
			await validateOpenClosed(triggers, accordion, [false, false, false]);
			expect(accordion).toHaveAttribute('data-orientation', 'vertical');
		});
		it('should open the trigger on click ', async () => {
			const { user, triggers, accordion } = await setup();
			await user.click(triggers[0]);
			await validateOpenClosed(triggers, accordion, [true, false, false]);
			await user.click(triggers[1]);
			await validateOpenClosed(triggers, accordion, [false, true, false]);
			await user.click(triggers[1]);
			await validateOpenClosed(triggers, accordion, [false, false, false]);
			await user.click(triggers[2]);
			await validateOpenClosed(triggers, accordion, [false, false, true]);
			await user.click(triggers[1]);
			await validateOpenClosed(triggers, accordion, [false, true, false]);
		});
		it('should open the trigger on enter and space ', async () => {
			const { user, triggers, accordion } = await setup();
			await user.keyboard('[Tab][Enter]');
			await validateOpenClosed(triggers, accordion, [true, false, false]);
			await user.keyboard('[Tab][Enter]');
			await validateOpenClosed(triggers, accordion, [false, true, false]);
			await user.keyboard('[Space]');
			await validateOpenClosed(triggers, accordion, [false, false, false]);
			await user.keyboard('[Tab][Enter]');
			await validateOpenClosed(triggers, accordion, [false, false, true]);
			await user.keyboard('{Shift>}[Tab]{/Shift}[Space]');
			await validateOpenClosed(triggers, accordion, [false, true, false]);
		});
		it('should open the trigger on enter and space and prevent default for enter also on second entry', async () => {
			const { user, accordion } = await setup();
			const keyboardEventEnter = createEvent.keyDown(accordion, {
				key: 'Enter',
				code: 'Enter',
				which: 13,
				keyCode: 13,
			});
			await user.keyboard('[Tab][Tab]');
			fireEvent(accordion, keyboardEventEnter);
			expect(keyboardEventEnter.defaultPrevented).toBe(true);
		});
	});
	describe('multi accordion', () => {
		it('initial state all datastate closed', async () => {
			const { triggers, accordion } = await setupMulti();
			await validateOpenClosed(triggers, accordion, [false, false, false]);
			expect(accordion).toHaveAttribute('data-orientation', 'horizontal');
		});
		it('should open the trigger on click ', async () => {
			const { user, triggers, accordion } = await setupMulti();

			await user.click(triggers[0]);
			await validateOpenClosed(triggers, accordion, [true, false, false]);
			await user.click(triggers[1]);
			await validateOpenClosed(triggers, accordion, [true, true, false]);
			await user.click(triggers[1]);
			await validateOpenClosed(triggers, accordion, [true, false, false]);
			await user.click(triggers[2]);
			await validateOpenClosed(triggers, accordion, [true, false, true]);
			await user.click(triggers[1]);
			await validateOpenClosed(triggers, accordion, [true, true, true]);
		});
	});

	describe('keyboard handling inside form controls', () => {
		it('should allow typing space in input', async () => {
			const { user, trigger, input } = await setupWithInput();
			await user.click(trigger);
			await user.tab();

			expect(trigger).toHaveAttribute('data-state', 'open');
			expect(input).toHaveFocus();

			await user.type(input, 'John Doe');
			expect(input).toHaveValue('John Doe');

			await user.tab({ shift: true });
			await user.keyboard('[Space]');
			expect(trigger).toHaveAttribute('data-state', 'closed');
			expect(trigger).toHaveFocus();
		});

		it('should allow typing enter and space in textarea', async () => {
			const { user, trigger, textarea } = await setupWithTextarea();
			await user.click(trigger);
			await user.tab();

			expect(trigger).toHaveAttribute('data-state', 'open');
			expect(textarea).toHaveFocus();

			await user.type(textarea, 'Hello{enter}World');
			expect(textarea).toHaveValue('Hello\nWorld');

			await user.type(textarea, ' with space');
			expect(textarea).toHaveValue('Hello\nWorld with space');
		});
	});
});
