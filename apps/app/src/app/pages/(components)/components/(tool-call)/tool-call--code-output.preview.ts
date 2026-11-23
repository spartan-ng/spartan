import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';
import { HlmToolCallImports } from '@spartan-ng/helm/tool-call';

@Component({
	selector: 'spartan-tool-call-code-output',
	imports: [HlmToolCallImports, HlmCodeBlockImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmToolCall class="w-96 max-w-full" name="query_users" state="result">
			<div hlmToolCallHeader>
				<span class="font-mono text-sm">query_users</span>
				<span hlmToolCallStatus>result</span>
			</div>
			<div hlmToolCallResult>
				<hlm-code-block size="sm">
					<pre hlmCodeBlockContent [code]="_output"></pre>
				</hlm-code-block>
			</div>
		</div>
	`,
})
export class ToolCallCodeOutput {
	protected readonly _output = JSON.stringify([{ id: 'usr_01', role: 'admin' }], null, 2);
}
