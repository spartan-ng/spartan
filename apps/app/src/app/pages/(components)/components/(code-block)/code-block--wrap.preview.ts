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
	protected readonly _output = `Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'Angular'. Current value: 'Angular 20'. Find more at https://angular.dev/errors/NG0100`;
}
