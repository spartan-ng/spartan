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
> next build
 ✓ Compiled successfully in 4.2s
 ✓ Generating static pages (12/12)
Route (app)                Size  First Load JS
┌ ○ /                    1.9 kB         112 kB
├ ○ /_not-found           993 B         103 kB
└ ƒ /api/chat             141 B         102 kB`;
}
