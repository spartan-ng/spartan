import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { render } from '@testing-library/angular';
import { HlmCommandDialog } from './hlm-command-dialog';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const flush = () => wait(0);

const EXIT_MS = 150;

const panel = () => document.querySelector('.cdk-overlay-pane');

@Component({
	imports: [HlmCommandDialog],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-command-dialog [state]="state()" />
	`,
})
class CommandDialogHost {
	public readonly state = signal<BrnDialogState>('closed');
}

const setup = async () => {
	const view = await render(CommandDialogHost);
	const commandDialog = view.fixture.debugElement.query(By.directive(HlmCommandDialog)).injector.get(HlmCommandDialog);
	const closedSpy = vi.fn();
	commandDialog.closed.subscribe(closedSpy);

	const setState = async (state: BrnDialogState) => {
		view.fixture.componentInstance.state.set(state);
		view.detectChanges();
		await flush();
	};

	return { closedSpy, setState };
};

describe('HlmCommandDialog', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('emits closed once the dialog has closed', async () => {
		const { closedSpy, setState } = await setup();

		await setState('open');
		expect(panel()).toBeTruthy();
		expect(closedSpy).not.toHaveBeenCalled();

		await setState('closed');
		await flush();

		expect(panel()).toBeNull();
		expect(closedSpy).toHaveBeenCalledTimes(1);
	});

	describe('with an exit animation', () => {
		let style: HTMLStyleElement;

		beforeEach(() => {
			// Global style: the overlay pane (which receives data-state) animates out when closing.
			style = document.createElement('style');
			style.textContent = `
				@keyframes hlm-test-command-dialog-exit { from { opacity: 1; } to { opacity: 0; } }
				.cdk-overlay-pane[data-state='closed'] {
					animation: hlm-test-command-dialog-exit ${EXIT_MS}ms linear;
				}
			`;
			document.head.appendChild(style);
		});

		afterEach(() => style.remove());

		it('emits closed only after the exit animation has finished', async () => {
			const { closedSpy, setState } = await setup();

			await setState('open');
			await setState('closed');

			// Still mounted during the exit animation, so closed has not fired yet.
			expect(panel()).toBeTruthy();
			expect(closedSpy).not.toHaveBeenCalled();

			await wait(EXIT_MS + 120);

			expect(panel()).toBeNull();
			expect(closedSpy).toHaveBeenCalledTimes(1);
		});
	});
});
