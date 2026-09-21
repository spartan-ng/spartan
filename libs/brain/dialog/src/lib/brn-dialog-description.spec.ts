import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import { BrnDialog } from './brn-dialog';
import { BrnDialogContent } from './brn-dialog-content';
import { BrnDialogDescription } from './brn-dialog-description';

function dialogContainer(): HTMLElement {
	const container = document.querySelector('cdk-dialog-container');
	if (!container) throw new Error('cdk-dialog-container not found');
	return container as HTMLElement;
}

@Component({
	imports: [BrnDialog, BrnDialogContent, BrnDialogDescription],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDialog [state]="state()">
			<ng-template brnDialogContent>
				@if (showDescription()) {
					<p brnDialogDescription data-testid="description">Some description</p>
				}
			</ng-template>
		</div>
	`,
})
class DialogWithDescriptionHost {
	public readonly state = signal<'open' | 'closed'>('open');
	public readonly showDescription = signal(true);
}

@Component({
	imports: [BrnDialog, BrnDialogContent, BrnDialogDescription],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDialog state="open" aria-describedby="external-description">
			<ng-template brnDialogContent>
				<p brnDialogDescription data-testid="description">Some description</p>
			</ng-template>
		</div>
	`,
})
class DialogWithExternalAriaDescribedByHost {}

@Component({
	imports: [BrnDialog, BrnDialogContent, BrnDialogDescription],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDialog state="open">
			<ng-template brnDialogContent>
				<p brnDialogDescription data-testid="description-1">First description</p>
				@if (showSecondDescription()) {
					<p brnDialogDescription data-testid="description-2">Second description</p>
				}
			</ng-template>
		</div>
	`,
})
class DialogWithMultipleDescriptionsHost {
	public readonly showSecondDescription = signal(true);
}

describe('BrnDialogDescription', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('sets the dialog aria-describedby to its own id while present', async () => {
		await render(DialogWithDescriptionHost);

		await waitFor(() => expect(dialogContainer()).toBeTruthy());
		const description = screen.getByTestId('description');

		expect(description.id).toMatch(/^brn-dialog-description-/);
		expect(dialogContainer().getAttribute('aria-describedby')).toBe(description.id);
	});

	it('clears the dialog aria-describedby when it is destroyed', async () => {
		const { fixture } = await render(DialogWithDescriptionHost);
		await waitFor(() => expect(dialogContainer().hasAttribute('aria-describedby')).toBe(true));

		fixture.componentInstance.showDescription.set(false);
		fixture.detectChanges();

		await waitFor(() => expect(dialogContainer().hasAttribute('aria-describedby')).toBe(false));
	});

	it('does not override an explicitly provided aria-describedby', async () => {
		await render(DialogWithExternalAriaDescribedByHost);

		await waitFor(() => expect(dialogContainer()).toBeTruthy());
		expect(dialogContainer().getAttribute('aria-describedby')).toBe('external-description');
	});

	it('retains the remaining description id when one of several descriptions is destroyed', async () => {
		const { fixture } = await render(DialogWithMultipleDescriptionsHost);

		const description1 = screen.getByTestId('description-1');
		const description2 = screen.getByTestId('description-2');
		expect(description1.id).not.toBe(description2.id);

		await waitFor(() => {
			const describedBy = dialogContainer().getAttribute('aria-describedby')?.split(' ') ?? [];
			expect(describedBy).toEqual(expect.arrayContaining([description1.id, description2.id]));
		});

		fixture.componentInstance.showSecondDescription.set(false);
		fixture.detectChanges();

		await waitFor(() => {
			expect(dialogContainer().getAttribute('aria-describedby')).toBe(description1.id);
		});
	});
});
