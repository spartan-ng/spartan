import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { render, waitFor } from '@testing-library/angular';
import { HlmDialog } from './hlm-dialog';
import { HlmDialogContent } from './hlm-dialog-content';
import { HlmDialogPortal } from './hlm-dialog-portal';

@Component({
	imports: [HlmDialog, HlmDialogContent, HlmDialogPortal, HlmComboboxImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog state="open" (stateChanged)="state.set($event)">
			<hlm-dialog-content *hlmDialogPortal="let ctx">
				<hlm-combobox [(value)]="value">
					<hlm-combobox-input />
					<hlm-combobox-content *hlmComboboxPortal>
						<div hlmComboboxList>
							<hlm-combobox-item value="angular">Angular</hlm-combobox-item>
						</div>
					</hlm-combobox-content>
				</hlm-combobox>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
class DialogWithComboboxHost {
	public readonly state = signal('open');
	public readonly value = signal<string | null>('angular');
}

const pressEscape = (target: Element) =>
	target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

describe('HlmDialog with a combobox', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('clears the combobox on the first Escape and closes the dialog on the second', async () => {
		const { fixture } = await render(DialogWithComboboxHost);
		const host = fixture.componentInstance;
		const input = await waitFor(() => {
			const element = document.querySelector<HTMLInputElement>('hlm-dialog-content input');
			if (!element) throw new Error('combobox input not rendered');
			return element;
		});

		pressEscape(input);
		fixture.detectChanges();

		expect(host.value()).toBeNull();
		expect(host.state()).toBe('open');

		pressEscape(input);
		fixture.detectChanges();

		expect(host.state()).toBe('closed');
	});
});
