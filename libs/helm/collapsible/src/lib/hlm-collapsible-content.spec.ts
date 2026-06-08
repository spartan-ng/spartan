import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { HlmCollapsibleImports } from '../index';

describe('HlmCollapsibleContent', () => {
	const setup = async () => {
		const view = await render(
			`
      <hlm-collapsible>
        <button hlmCollapsibleTrigger data-testid='trigger'>Toggle</button>
        <hlm-collapsible-content data-testid='content'>content</hlm-collapsible-content>
      </hlm-collapsible>
    `,
			{ imports: [...HlmCollapsibleImports] },
		);

		return {
			view,
			user: userEvent.setup(),
			content: screen.getByTestId('content'),
			trigger: screen.getByTestId('trigger'),
		};
	};

	it('renders the content as a block-level element', async () => {
		const { content } = await setup();
		expect(content.className).toContain('block');
	});

	it('removes non-animated content from the layout while closed', async () => {
		const { content } = await setup();
		expect(content.style.display).toBe('none');
	});

	it('shows the content once opened', async () => {
		const { view, user, content, trigger } = await setup();

		await user.click(trigger);
		view.detectChanges();

		expect(content.style.display).not.toBe('none');
	});
});
