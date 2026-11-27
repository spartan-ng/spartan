import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ToolCallState } from '@spartan-ng/brain/tool-call';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmToolCallImports } from '@spartan-ng/helm/tool-call';

@Component({
	selector: 'spartan-tool-call-error',
	imports: [HlmToolCallImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmToolCall class="w-96 max-w-full" name="send_webhook" [state]="_state()" (retried)="_state.set('executing')">
			<div hlmToolCallHeader>
				<span class="font-mono text-sm">send_webhook</span>
				<span hlmToolCallStatus>{{ _state() }}</span>
			</div>
			@if (_state() === 'error') {
				<div hlmToolCallError>Gateway Timeout (504): the endpoint did not respond in time.</div>
				<div hlmToolCallActions>
					<button hlmBtn hlmToolCallRetry variant="outline" size="sm">Retry</button>
				</div>
			}
		</div>
	`,
})
export class ToolCallError {
	protected readonly _state = signal<ToolCallState>('error');
}
