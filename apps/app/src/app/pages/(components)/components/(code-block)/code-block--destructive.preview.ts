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
	protected readonly _error = `TypeError: Cannot read properties of undefined (reading 'pipe')
    at MessageListComponent.ngOnInit (app/message-list.component.ts:18:22)
    at callHook (core.mjs:16305:18)`;
}
