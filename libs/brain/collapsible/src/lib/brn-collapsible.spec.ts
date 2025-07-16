import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { BrnCollapsible } from './brn-collapsible';
import { BrnCollapsibleContent } from './brn-collapsible-content';
import { BrnCollapsibleTrigger } from './brn-collapsible-trigger';

describe('BrnCollapsibleComponent', () => {
	const setup = async (id?: string, disabled = false) => {
		const container = await render(
			`
     <brn-collapsible ${disabled ? 'disabled' : ''} data-testid='root'>
      <div>
        <h4>&#64;peduarte starred 3 repositories</h4>
        <button brnCollapsibleTrigger data-testid='trigger'>Toggle</button>
      </div>
      <div>&#64;radix-ui/primitives</div>
      <brn-collapsible-content ${id ? `id=${id}` : ''} data-testid='content'>
        <div>&#64;radix-ui/colors</div>
        <div>&#64;stitches/react</div>
      </brn-collapsible-content>
    </brn-collapsible>
    `,
			{
				imports: [BrnCollapsible, BrnCollapsibleContent, BrnCollapsibleTrigger],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			triggerElement: screen.getByTestId('trigger'),
		};
	};

	type Options = {
		root: HTMLElement;
		trigger: HTMLElement;
		content: HTMLElement;
		id?: string;
	};
	const validateAttributes = async ({ root, trigger, content, id }: Options) => {
		const idMatcher = id ?? expect.stringContaining('brn-collapsible-content');
		expect(root).toBeInTheDocument();
		expect(await axe(root)).toHaveNoViolations();

		expect(trigger).toBeInTheDocument();
		expect(trigger).toHaveAttribute('aria-controls', idMatcher);
		expect(await axe(trigger)).toHaveNoViolations();

		expect(content).toBeInTheDocument();
		expect(content).toHaveAttribute('id', idMatcher);
		expect(await axe(trigger)).toHaveNoViolations();
	};
	const validateOpen = async (id?: string) => {
		const root = await screen.findByTestId('root');
		const trigger = await screen.findByTestId('trigger');
		const content = await screen.findByTestId('content');

		expect(root).toHaveAttribute('data-state', 'open');
		expect(trigger).toHaveAttribute('data-state', 'open');
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(content).toHaveAttribute('data-state', 'open');

		await validateAttributes({ root, trigger, content, id });
	};
	const validateClosed = async (id?: string) => {
		const root = await screen.findByTestId('root');
		const trigger = await screen.findByTestId('trigger');
		const content = await screen.findByTestId('content');

		expect(root).toHaveAttribute('data-state', 'closed');
		expect(trigger).toHaveAttribute('data-state', 'closed');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(content).toHaveAttribute('data-state', 'closed');

		await validateAttributes({ root, trigger, content, id });
	};

	it('not given id on content should create id and set it to aria-described. by default collapsible is closed', async () => {
		await setup();
		await validateClosed();
	});

	it('given id on content should use id and set it to aria-described. by default collapsible is closed', async () => {
		await setup('hello-world');
		await validateClosed('hello-world');
	});

	it('mouse click on element toggles collapsible', async () => {
		const { user, container, triggerElement } = await setup();
		await validateClosed();
		await user.click(triggerElement);
		container.detectChanges();
		await validateOpen();
		await user.click(triggerElement);
		container.detectChanges();
		await validateClosed();
	});

	it('focus with tab and enter toggles collapsible', async () => {
		const { user, container } = await setup();
		await validateClosed();
		await user.keyboard('[Tab][Enter]');
		container.detectChanges();
		await validateOpen();
		await user.keyboard('[Enter]');
		container.detectChanges();
		await validateClosed();
		await user.keyboard('[Enter]');
		container.detectChanges();
		await validateOpen();
	});

	it('focus with tab and space toggles collapsible', async () => {
		const { user, container } = await setup();
		await validateClosed();
		await user.keyboard('[Tab][Space]');
		container.detectChanges();
		await validateOpen();
		await user.keyboard('[Space]');
		container.detectChanges();
		await validateClosed();
		await user.keyboard('[Space]');
		container.detectChanges();
		await validateOpen();
	});

	it('disabled adds correct aria attributes and prevents toggle', async () => {
		const { user, container, triggerElement } = await setup(undefined, true);
		const root = await screen.findByTestId('root');

		expect(root).toHaveAttribute('disabled');
		expect(triggerElement).toHaveAttribute('disabled');

		await validateClosed();
		await user.click(triggerElement);
		container.detectChanges();
		await validateClosed();
		await user.keyboard('[Enter]');
		container.detectChanges();
		await validateClosed();
		await user.keyboard('[Space]');
		container.detectChanges();
		await validateClosed();
	});
});
