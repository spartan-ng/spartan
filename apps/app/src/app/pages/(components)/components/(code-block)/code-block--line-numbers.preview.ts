import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

@Component({
	selector: 'spartan-code-block-line-numbers',
	imports: [HlmCodeBlockImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-md">
			<hlm-code-block>
				<pre hlmCodeBlockContent [code]="_code" lineNumbers></pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockLineNumbers {
	protected readonly _code = `{
  "name": "chat",
  "private": true,
  "scripts": {
    "start": "ng serve",
    "build": "ng build"
  }
}`;
}
