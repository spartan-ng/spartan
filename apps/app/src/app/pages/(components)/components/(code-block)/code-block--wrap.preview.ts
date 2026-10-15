import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

@Component({
	selector: 'spartan-code-block-wrap',
	imports: [HlmCodeBlockImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="grid w-full max-w-md gap-4">
			<hlm-code-block>
				<pre hlmCodeBlockContent [code]="_output"></pre>
			</hlm-code-block>
			<hlm-code-block>
				<pre hlmCodeBlockContent [code]="_output" wrap></pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockWrap {
	protected readonly _output = `Error: The model "anthropic/claude-sonnet-4.5" returned an error: Request too large. The prompt is 212,431 tokens and the context window is 200,000 tokens. Remove some messages or summarize the conversation and try again.`;
}
