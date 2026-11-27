import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ToolCallState } from '@spartan-ng/brain/tool-call';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmToolCallImports } from '@spartan-ng/helm/tool-call';

@Component({
	selector: 'spartan-tool-call-preview',
	imports: [HlmToolCallImports, HlmButtonImports, JsonPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			hlmToolCall
			class="w-96 max-w-full"
			name="delete_records"
			[state]="_state()"
			(approved)="_approve()"
			(rejected)="_state.set('denied')"
			(retried)="_state.set('result')"
		>
			<div hlmToolCallHeader>
				<span class="font-mono text-sm">delete_records</span>
				<span hlmToolCallStatus>{{ _state() }}</span>
				<button hlmToolCallTrigger>Details</button>
			</div>
			<div hlmToolCallArgs>{{ _args | json }}</div>
			@if (_state() === 'result') {
				<div hlmToolCallResult>Deleted 1,420 records.</div>
			}
			@if (_state() === 'requires-approval') {
				<div hlmToolCallActions>
					<button hlmBtn hlmToolCallReject variant="outline" size="sm">Reject</button>
					<button hlmBtn hlmToolCallApprove size="sm">Approve</button>
				</div>
			}
			@if (_state() === 'denied') {
				<div hlmToolCallError>Rejected by the user.</div>
				<div hlmToolCallActions>
					<button hlmBtn hlmToolCallRetry variant="outline" size="sm">Retry</button>
				</div>
			}
		</div>
	`,
})
export class ToolCallPreview {
	protected readonly _state = signal<ToolCallState>('requires-approval');
	protected _approve(): void {
		this._state.set('approval-responded');
		setTimeout(() => this._state.set('result'), 1200);
	}

	protected readonly _args = { table: 'users_archive', criteria: 'inactive_gt_365d' };
}

export const defaultImports = `
import { HlmToolCallImports } from '@spartan-ng/helm/tool-call';
import { HlmButtonImports } from '@spartan-ng/helm/button';
`;

export const defaultSkeleton = `
<div hlmToolCall [name]="tool.name" [state]="tool.state">
  <div hlmToolCallHeader>
    <span>{{ tool.name }}</span>
    <button hlmToolCallTrigger>Details</button>
  </div>
  <div hlmToolCallArgs>{{ tool.args | json }}</div>
  @if (tool.state === 'requires-approval') {
    <div hlmToolCallActions>
      <button hlmBtn hlmToolCallReject variant="outline">Reject</button>
      <button hlmBtn hlmToolCallApprove>Approve</button>
    </div>
  }
  @if (tool.state === 'denied') {
    <div hlmToolCallActions>
      <button hlmBtn hlmToolCallRetry variant="outline">Retry</button>
    </div>
  }
</div>
`;
