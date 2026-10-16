import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

@Component({
	selector: 'spartan-code-block-floating-actions',
	imports: [HlmCodeBlockImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-md">
			<hlm-code-block>
				<hlm-code-block-actions>
					<button hlmCodeBlockCopyButton [value]="_output"></button>
				</hlm-code-block-actions>
				<pre hlmCodeBlockContent [code]="_output"></pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockFloatingActions {
	protected readonly _output = `$ pnpm add @spartan-ng/brain
Progress: resolved 412, reused 398, downloaded 14, added 14, done
dependencies:
+ @angular/cdk 20.2.0
+ @spartan-ng/brain 1.0.0
+ @spartan-ng/helm 1.0.0
Done in 2.8s using pnpm v10.18.0`;
}
