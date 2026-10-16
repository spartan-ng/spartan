import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

@Component({
	selector: 'spartan-code-block-basic',
	imports: [HlmCodeBlockImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-md">
			<hlm-code-block>
				<pre hlmCodeBlockContent>{{ _output }}</pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockBasic {
	protected readonly _output = `$ pnpm build
> ng build

✔ Browser application bundle generation complete.

Initial chunk files | Names     |  Raw size
polyfills.js        | polyfills |  34.52 kB
main.js             | main      | 210.45 kB

Output location: dist/app`;
}
