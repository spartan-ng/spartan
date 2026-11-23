import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ToolCallState } from '@spartan-ng/brain/tool-call';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmToolCallImports } from '@spartan-ng/helm/tool-call';

@Component({
	selector: 'spartan-tool-call-reject-reason',
	imports: [HlmToolCallImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-96 max-w-full flex-col gap-2">
			<div hlmToolCall name="send_email" [state]="_state()" (rejected)="_reject($event)">
				<div hlmToolCallHeader>
					<span class="font-mono text-sm">send_email</span>
				</div>
				<div hlmToolCallActions>
					<button hlmBtn hlmToolCallReject reason="Not allowed by policy" variant="outline" size="sm">Reject</button>
					<button hlmBtn hlmToolCallApprove size="sm">Approve</button>
				</div>
			</div>
			@if (_reason()) {
				<p class="text-muted-foreground text-xs">Rejected: {{ _reason() }}</p>
			}
		</div>
	`,
})
export class ToolCallRejectReason {
	protected readonly _state = signal<ToolCallState>('requires-approval');
	protected readonly _reason = signal('');

	protected _reject(reason?: string): void {
		this._reason.set(reason ?? '');
		this._state.set('denied');
	}
}
