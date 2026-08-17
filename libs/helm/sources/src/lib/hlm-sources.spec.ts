import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { HlmSource } from './hlm-source';
import { HlmSources } from './hlm-sources';
import { HlmSourcesContent } from './hlm-sources-content';
import { HlmSourcesTrigger } from './hlm-sources-trigger';

describe('HlmSources', () => {
	const setup = async () => {
		const container = await render(
			`
			<div hlmSources data-testid="root">
				<button hlmSourcesTrigger [count]="2" data-testid="trigger"></button>
				<div hlmSourcesContent data-testid="content">
					<a hlmSource href="https://example.com" title="Example" data-testid="source"></a>
				</div>
			</div>
			`,
			{ imports: [HlmSources, HlmSourcesTrigger, HlmSourcesContent, HlmSource] },
		);
		return {
			user: userEvent.setup(),
			container,
			root: screen.getByTestId('root'),
			trigger: screen.getByTestId('trigger'),
			content: screen.getByTestId('content'),
			source: screen.getByTestId('source'),
		};
	};

	it('is closed by default', async () => {
		const { root, trigger, content } = await setup();
		expect(root).toHaveAttribute('data-state', 'closed');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(content).toHaveAttribute('data-state', 'closed');
	});

	it('renders the source count in the default trigger label', async () => {
		const { trigger } = await setup();
		expect(trigger).toHaveTextContent('Used 2 sources');
	});

	it('mouse click on trigger toggles the collapsible', async () => {
		const { user, container, trigger, root } = await setup();
		expect(root).toHaveAttribute('data-state', 'closed');
		await user.click(trigger);
		container.detectChanges();
		expect(root).toHaveAttribute('data-state', 'open');
		await user.click(trigger);
		container.detectChanges();
		expect(root).toHaveAttribute('data-state', 'closed');
	});

	it('renders the source title and href by default', async () => {
		const { source } = await setup();
		expect(source).toHaveAttribute('href', 'https://example.com');
		expect(source).toHaveTextContent('Example');
	});
});
