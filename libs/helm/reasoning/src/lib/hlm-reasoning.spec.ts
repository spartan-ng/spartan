import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { HlmReasoning } from './hlm-reasoning';
import { HlmReasoningContent } from './hlm-reasoning-content';
import { HlmReasoningTrigger } from './hlm-reasoning-trigger';

describe('HlmReasoning', () => {
	const setup = async (isStreaming = false) => {
		const container = await render(
			`
			<div hlmReasoning [isStreaming]="isStreaming" data-testid="root">
				<button hlmReasoningTrigger data-testid="trigger"></button>
				<div hlmReasoningContent data-testid="content">Reasoning text</div>
			</div>
			`,
			{
				imports: [HlmReasoning, HlmReasoningTrigger, HlmReasoningContent],
				componentProperties: { isStreaming },
			},
		);
		return {
			user: userEvent.setup(),
			container,
			root: screen.getByTestId('root'),
			trigger: screen.getByTestId('trigger'),
			content: screen.getByTestId('content'),
		};
	};

	it('is closed by default when not streaming', async () => {
		const { root, trigger, content } = await setup(false);
		expect(root).toHaveAttribute('data-state', 'closed');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(content).toHaveAttribute('data-state', 'closed');
	});

	it('auto-opens when isStreaming is true', async () => {
		const { root, trigger } = await setup(true);
		expect(root).toHaveAttribute('data-state', 'open');
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('mouse click on trigger toggles the collapsible', async () => {
		const { user, container, trigger, root } = await setup(false);
		expect(root).toHaveAttribute('data-state', 'closed');
		await user.click(trigger);
		container.detectChanges();
		expect(root).toHaveAttribute('data-state', 'open');
		await user.click(trigger);
		container.detectChanges();
		expect(root).toHaveAttribute('data-state', 'closed');
	});
});
