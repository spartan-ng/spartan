import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

@Component({
	selector: 'spartan-code-block-height',
	imports: [HlmCodeBlockImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-md">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>Logs</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="_logs"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="_logs" class="scroll-fade-y max-h-64"></pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockHeight {
	protected readonly _logs = Array.from(
		{ length: 40 },
		(_, index) =>
			`[${String(index + 1).padStart(2, '0')}] GET /api/chat 200 in ${12 + Math.floor(index / 6) * 2 + (index % 6) * 7}ms`,
	).join('\n');
}
