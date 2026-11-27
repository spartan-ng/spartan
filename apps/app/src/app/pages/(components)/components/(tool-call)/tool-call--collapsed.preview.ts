import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmToolCallImports } from '@spartan-ng/helm/tool-call';

@Component({
	selector: 'spartan-tool-call-collapsed',
	imports: [HlmToolCallImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmToolCall class="w-96 max-w-full" name="search_docs" state="result" [expanded]="false">
			<div hlmToolCallHeader>
				<span class="font-mono text-sm">search_docs</span>
				<button hlmToolCallTrigger>Details</button>
			</div>
			<div hlmToolCallArgs>{{ '{ "query": "hlm tool call" }' }}</div>
			<div hlmToolCallResult>3 results found.</div>
		</div>
	`,
})
export class ToolCallCollapsed {}
