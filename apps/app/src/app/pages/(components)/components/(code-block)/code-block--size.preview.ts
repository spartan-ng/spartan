import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

@Component({
	selector: 'spartan-code-block-size',
	imports: [HlmCodeBlockImports, NgIcon],
	providers: [provideIcons({ lucideTerminal })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="grid w-full max-w-md gap-4">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>
						<ng-icon name="lucideTerminal" />
						Terminal
					</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="_output"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="_output"></pre>
			</hlm-code-block>
			<hlm-code-block size="sm">
				<hlm-code-block-header>
					<hlm-code-block-title>
						<ng-icon name="lucideTerminal" />
						Terminal
					</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="_output"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="_output" wrap></pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockSize {
	protected readonly _output = `$ pnpm add ai @ai-sdk/react zod
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0`;
}
