import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { BrnToolCall } from './brn-tool-call';
import { BrnToolCallApprove } from './brn-tool-call-approve';
import { BrnToolCallPanel } from './brn-tool-call-panel';
import { BrnToolCallReject } from './brn-tool-call-reject';
import { BrnToolCallRetry } from './brn-tool-call-retry';
import { BrnToolCallTrigger } from './brn-tool-call-trigger';
import type { ToolCallState } from './brn-tool-call.types';

@Component({
	imports: [BrnToolCall, BrnToolCallTrigger, BrnToolCallApprove, BrnToolCallReject, BrnToolCallRetry, BrnToolCallPanel],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnToolCall
			[name]="name()"
			[state]="state()"
			(approved)="onApproved()"
			(rejected)="onRejected($event)"
			(retried)="onRetried()"
		>
			<button brnToolCallTrigger data-testid="trigger-btn">Toggle Details</button>
			<button brnToolCallApprove data-testid="approve-btn">Approve</button>
			<button brnToolCallReject [reason]="rejectReason()" data-testid="reject-btn">Reject</button>
			<button brnToolCallRetry data-testid="retry-btn">Retry</button>
			<div brnToolCallPanel data-testid="panel">Panel</div>
		</div>
	`,
})
class ToolCallSpecComponent {
	public readonly name = input('search_database');
	public readonly state = input<ToolCallState>('executing');
	public readonly rejectReason = input<string | undefined>(undefined);
	public readonly approved = output<void>();
	public readonly rejected = output<string | undefined>();
	public readonly retried = output<void>();

	protected onApproved(): void {
		this.approved.emit();
	}

	protected onRejected(reason?: string): void {
		this.rejected.emit(reason);
	}

	protected onRetried(): void {
		this.retried.emit();
	}
}

describe('BrnToolCall', () => {
	it('should render with initial data-slot, data-state, and expanded state', async () => {
		const { container, getByTestId } = await render(ToolCallSpecComponent);

		const root = container.querySelector('[data-slot="tool-call"]');
		expect(root).not.toBeNull();
		expect(root?.getAttribute('data-state')).toBe('executing');
		expect(root?.getAttribute('data-expanded')).toBe('true');

		const trigger = getByTestId('trigger-btn');
		expect(trigger.getAttribute('aria-expanded')).toBe('true');
	});

	it('should toggle expanded state when trigger button is clicked', async () => {
		const { container, getByTestId } = await render(ToolCallSpecComponent);

		const root = container.querySelector('[data-slot="tool-call"]');
		const trigger = getByTestId('trigger-btn');

		fireEvent.click(trigger);
		expect(root?.getAttribute('data-expanded')).toBe('false');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');

		fireEvent.click(trigger);
		expect(root?.getAttribute('data-expanded')).toBe('true');
		expect(trigger.getAttribute('aria-expanded')).toBe('true');
	});

	it('should emit approved event when approve button is clicked', async () => {
		const approveSpy = vi.fn();
		const { getByTestId } = await render(ToolCallSpecComponent, {
			componentInputs: { state: 'requires-approval' },
			on: { approved: approveSpy },
		});

		const approveBtn = getByTestId('approve-btn');
		fireEvent.click(approveBtn);

		expect(approveSpy).toHaveBeenCalledOnce();
	});

	it('should emit rejected event with optional reason when reject button is clicked', async () => {
		const rejectSpy = vi.fn();
		const { getByTestId } = await render(ToolCallSpecComponent, {
			componentInputs: {
				state: 'requires-approval',
				rejectReason: 'Permission denied by user',
			},
			on: { rejected: rejectSpy },
		});

		const rejectBtn = getByTestId('reject-btn');
		fireEvent.click(rejectBtn);

		expect(rejectSpy).toHaveBeenCalledWith('Permission denied by user');
	});

	it('should emit retried event when retry button is clicked', async () => {
		const retrySpy = vi.fn();
		const { getByTestId } = await render(ToolCallSpecComponent, {
			componentInputs: { state: 'error' },
			on: { retried: retrySpy },
		});

		const retryBtn = getByTestId('retry-btn');
		fireEvent.click(retryBtn);

		expect(retrySpy).toHaveBeenCalledOnce();
	});

	it('should ignore approve and reject outside requires-approval', async () => {
		const approvedSpy = vi.fn();
		const rejectedSpy = vi.fn();
		const { getByTestId } = await render(ToolCallSpecComponent, {
			componentInputs: { state: 'executing' },
			on: { approved: approvedSpy, rejected: rejectedSpy },
		});

		fireEvent.click(getByTestId('approve-btn'));
		fireEvent.click(getByTestId('reject-btn'));

		expect(approvedSpy).not.toHaveBeenCalled();
		expect(rejectedSpy).not.toHaveBeenCalled();
	});

	it('should link the trigger to the rendered panel via aria-controls', async () => {
		const { getByTestId } = await render(ToolCallSpecComponent);

		const panelId = getByTestId('panel').id;
		expect(panelId).toMatch(/^brn-tool-call-panel-/);
		expect(getByTestId('trigger-btn').getAttribute('aria-controls')).toBe(panelId);
	});

	it('should ignore retry outside error or denied', async () => {
		const retrySpy = vi.fn();
		const { getByTestId } = await render(ToolCallSpecComponent, {
			componentInputs: { state: 'executing' },
			on: { retried: retrySpy },
		});

		fireEvent.click(getByTestId('retry-btn'));

		expect(retrySpy).not.toHaveBeenCalled();
	});

	it('should expose the tool name as the accessible name of the group', async () => {
		const { getByRole } = await render(ToolCallSpecComponent);

		expect(getByRole('group', { name: 'search_database' })).not.toBeNull();
	});
});
