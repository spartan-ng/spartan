import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { BrnConfirmation } from './brn-confirmation';
import { BrnConfirmationApprove } from './brn-confirmation-approve';
import { BrnConfirmationReject } from './brn-confirmation-reject';
import type { ConfirmationState } from './brn-confirmation.types';

@Component({
	imports: [BrnConfirmation, BrnConfirmationApprove, BrnConfirmationReject],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnConfirmation [state]="state()" (approved)="onApproved()" (rejected)="onRejected($event)">
			<button brnConfirmationApprove data-testid="approve-btn">Approve</button>
			<button brnConfirmationReject reason="Not allowed" data-testid="reject-btn">Reject</button>
		</div>
	`,
})
class ConfirmationSpecComponent {
	public readonly state = input<ConfirmationState>('pending');
	public readonly approvedSpy = vi.fn();
	public readonly rejectedSpy = vi.fn();

	protected onApproved(): void {
		this.approvedSpy();
	}

	protected onRejected(reason?: string): void {
		this.rejectedSpy(reason);
	}
}

describe('BrnConfirmation', () => {
	it('should render with data-slot, group role and pending state', async () => {
		const { container } = await render(ConfirmationSpecComponent);

		const root = container.querySelector('[data-slot="confirmation"]');
		expect(root?.getAttribute('data-state')).toBe('pending');
		expect(root?.getAttribute('role')).toBe('group');
	});

	it('should emit approved when approve is clicked while pending', async () => {
		const { getByTestId, fixture } = await render(ConfirmationSpecComponent);

		fireEvent.click(getByTestId('approve-btn'));

		expect(fixture.componentInstance.approvedSpy).toHaveBeenCalledOnce();
	});

	it('should emit rejected with the reason when reject is clicked while pending', async () => {
		const { getByTestId, fixture } = await render(ConfirmationSpecComponent);

		fireEvent.click(getByTestId('reject-btn'));

		expect(fixture.componentInstance.rejectedSpy).toHaveBeenCalledWith('Not allowed');
	});

	it('should ignore approve and reject once a decision was made', async () => {
		const { getByTestId, fixture } = await render(ConfirmationSpecComponent, {
			componentInputs: { state: 'approved' },
		});

		fireEvent.click(getByTestId('approve-btn'));
		fireEvent.click(getByTestId('reject-btn'));

		expect(fixture.componentInstance.approvedSpy).not.toHaveBeenCalled();
		expect(fixture.componentInstance.rejectedSpy).not.toHaveBeenCalled();
	});
});
