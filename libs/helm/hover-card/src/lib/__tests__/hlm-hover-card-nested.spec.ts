import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { HlmHoverCardImports } from '../../index';

const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-hover-card-nested-host',
	imports: [HlmHoverCardImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-hover-card>
			<button hlmHoverCardTrigger showDelay="0" hideDelay="0" data-testid="outer-trigger">outer</button>
			<hlm-hover-card-content *hlmHoverCardPortal>
				<hlm-hover-card>
					<button hlmHoverCardTrigger showDelay="0" hideDelay="0" animationDelay="200" data-testid="nested-trigger">
						nested
					</button>
					<hlm-hover-card-content *hlmHoverCardPortal>
						<span data-testid="nested-content">nested content</span>
					</hlm-hover-card-content>
				</hlm-hover-card>
			</hlm-hover-card-content>
		</hlm-hover-card>
	`,
})
class NestedHoverCardHost {}

const contents = () => Array.from(document.querySelectorAll<HTMLElement>('hlm-hover-card-content'));

describe('HlmHoverCard nested content', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('closes only the nested content and keeps the parent content open', async () => {
		const view = await render(NestedHoverCardHost);

		fireEvent.mouseEnter(document.querySelector('[data-testid="outer-trigger"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		fireEvent.mouseEnter(document.querySelector('[data-testid="nested-trigger"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		expect(contents()).toHaveLength(2);

		fireEvent.mouseLeave(document.querySelector('[data-testid="nested-trigger"]') as HTMLButtonElement);
		view.detectChanges();
		await flush();

		const [outerContent, nestedContent] = contents();
		expect(nestedContent.getAttribute('data-state')).toBe('closed');
		expect(outerContent.getAttribute('data-state')).toBe('open');
	});
});
