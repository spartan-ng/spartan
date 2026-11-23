import { Directive, input, model, output } from '@angular/core';
import { BRN_TOOL_CALL_TOKEN } from './brn-tool-call.token';
import type { ToolCallState } from './brn-tool-call.types';

@Directive({
	selector: '[brnToolCall],brn-tool-call',
	exportAs: 'brnToolCall',
	providers: [
		{
			provide: BRN_TOOL_CALL_TOKEN,
			useExisting: BrnToolCall,
		},
	],
	host: {
		'data-slot': 'tool-call',
		'[attr.data-state]': 'state()',
		'[attr.data-expanded]': 'expanded() ? "true" : "false"',
	},
})
export class BrnToolCall {
	/** Identifier / name of the tool being executed (e.g. 'execute_bash'). */
	public readonly name = input.required<string>();

	/** Lifecycle state of the tool invocation. */
	public readonly state = input<ToolCallState>('executing');

	/** Whether the tool arguments/details section is expanded. */
	public readonly expanded = model<boolean>(true);

	/** Emits when human approval is granted. */
	public readonly approved = output<void>();

	/** Emits when human rejection is triggered with an optional feedback reason. */
	public readonly rejected = output<string | void>();

	/** Emits when tool retry is requested. */
	public readonly retried = output<void>();

	public toggleExpanded(): void {
		this.expanded.update((prev) => !prev);
	}

	public requestApprove(): void {
		this.approved.emit();
	}

	public requestReject(reason?: string): void {
		this.rejected.emit(reason);
	}

	public requestRetry(): void {
		this.retried.emit();
	}
}
