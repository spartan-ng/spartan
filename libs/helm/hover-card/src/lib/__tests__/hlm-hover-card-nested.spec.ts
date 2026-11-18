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

// The real browser pointer rests wherever the previous interaction left it. When an overlay opens
// underneath it, the browser dispatches trusted mouse events (e.g. a mouseleave on the outer content)
// that race with the synthetic events below. Ignore them so only the test drives hover state.
const pointerEvents = ['mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
const ignoreRealPointer = (event: Event) => {
	if (event.isTrusted) event.stopImmediatePropagation();
};

describe('HlmHoverCard nested content', () => {
	beforeEach(() => {
		pointerEvents.forEach((type) => window.addEventListener(type, ignoreRealPointer, true));
	});

	afterEach(() => {
		pointerEvents.forEach((type) => window.removeEventListener(type, ignoreRealPointer, true));
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
