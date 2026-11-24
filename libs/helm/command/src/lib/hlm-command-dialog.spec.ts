import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { render } from '@testing-library/angular';
import { HlmCommandDialog } from './hlm-command-dialog';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const panel = () => document.querySelector('.cdk-overlay-pane');

@Component({
	imports: [HlmCommandDialog],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-command-dialog [state]="state()" (closed)="closedCount.set(closedCount() + 1)">
			<span data-testid="content">content</span>
		</hlm-command-dialog>
	`,
})
class CommandDialogHost {
	public readonly state = signal<BrnDialogState>('closed');
	public readonly closedCount = signal(0);
}

describe('HlmCommandDialog', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('emits closed once the dialog has been closed and its overlay disposed', async () => {
		const { fixture } = await render(CommandDialogHost);
		const host = fixture.componentInstance;

		host.state.set('open');
		fixture.detectChanges();
		await flush();
		expect(panel()).toBeTruthy();
		expect(host.closedCount()).toBe(0);

		host.state.set('closed');
		fixture.detectChanges();
		await flush();
		await flush();

		expect(panel()).toBeNull();
		expect(host.closedCount()).toBe(1);
	});
});
