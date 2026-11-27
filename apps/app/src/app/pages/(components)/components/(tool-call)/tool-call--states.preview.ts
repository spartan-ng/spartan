import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type ToolCallState } from '@spartan-ng/brain/tool-call';
import { HlmToolCallImports } from '@spartan-ng/helm/tool-call';

@Component({
	selector: 'spartan-tool-call-states',
	imports: [HlmToolCallImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-96 max-w-full flex-col gap-3">
			@for (state of _states; track state) {
				<div hlmToolCall name="search_docs" [state]="state">
					<div hlmToolCallHeader>
						<span class="font-mono text-sm">search_docs</span>
						<span hlmToolCallStatus>{{ state }}</span>
					</div>
				</div>
			}
		</div>
	`,
})
export class ToolCallStates {
	protected readonly _states: ToolCallState[] = [
		'pending',
		'executing',
		'requires-approval',
		'approval-responded',
		'result',
		'error',
		'denied',
	];
}
