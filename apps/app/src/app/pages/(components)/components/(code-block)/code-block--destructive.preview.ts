import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

@Component({
	selector: 'spartan-code-block-destructive',
	imports: [HlmCodeBlockImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-md">
			<hlm-code-block variant="destructive">
				<hlm-code-block-header>
					<hlm-code-block-title>Error</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="_error"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="_error" wrap></pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockDestructive {
	protected readonly _error = `TypeError: Cannot read properties of undefined (reading 'map')
    at MessageList (components/message-list.tsx:18:22)
    at renderWithHooks (react-dom.development.js:16305:18)`;
}
