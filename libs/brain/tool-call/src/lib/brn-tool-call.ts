import { Directive, input, model, output, signal } from '@angular/core';
import { BRN_TOOL_CALL_TOKEN } from './brn-tool-call.token';
import type { ToolCallState } from './brn-tool-call.types';

let toolCallIdSequence = 0;

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
		role: 'group',
		'[attr.aria-label]': 'name()',
		'[attr.data-state]': 'state()',
		'[attr.data-expanded]': 'expanded() ? "true" : "false"',
	},
})
export class BrnToolCall {
	/** Unique id used to derive ids of the collapsible panels. */
	public readonly id = `brn-tool-call-${++toolCallIdSequence}`;

	private readonly _panelIds = signal<readonly string[]>([]);

	/** Ids of the currently rendered collapsible panels (args, result), referenced by the trigger's aria-controls. */
	public readonly panelIds = this._panelIds.asReadonly();

	/** Identifier / name of the tool being executed (e.g. 'execute_bash'). */
	public readonly name = input.required<string>();

	/** Lifecycle state of the tool invocation. */
	public readonly state = input<ToolCallState>('executing');

	/** Whether the tool arguments/details section is expanded. */
	public readonly expanded = model<boolean>(true);

	/** Emits when human approval is granted. */
	public readonly approved = output<void>();

	/** Emits when human rejection is triggered with an optional feedback reason. */
	public readonly rejected = output<string | undefined>();

	/** Emits when tool retry is requested. */
	public readonly retried = output<void>();

	public registerPanel(id: string): void {
		this._panelIds.update((ids) => [...ids, id]);
	}

	public unregisterPanel(id: string): void {
		this._panelIds.update((ids) => ids.filter((x) => x !== id));
	}

	public toggleExpanded(): void {
		this.expanded.update((prev) => !prev);
	}

	public requestApprove(): void {
		if (this.state() !== 'requires-approval') {
			return;
		}
		this.approved.emit();
	}

	public requestReject(reason?: string): void {
		if (this.state() !== 'requires-approval') {
			return;
		}
		this.rejected.emit(reason);
	}

	public requestRetry(): void {
		if (this.state() !== 'error' && this.state() !== 'denied') {
			return;
		}
		this.retried.emit();
	}
}
