import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

type Line = { text: string; variant: 'default' | 'highlighted' };

@Component({
	selector: 'spartan-code-block-highlighted-lines',
	imports: [HlmCodeBlockImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-md">
			<hlm-code-block>
				<pre hlmCodeBlockContent lineNumbers>
					@for (line of _lines; track $index) {
						<span hlmCodeBlockLine [variant]="line.variant">{{ line.text }}</span>
					}
				</pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockHighlightedLines {
	protected readonly _lines: Line[] = [
		{ text: 'export default {', variant: 'default' },
		{ text: '  experimental: {', variant: 'default' },
		{ text: '    reactCompiler: true,', variant: 'highlighted' },
		{ text: '    viewTransition: true,', variant: 'highlighted' },
		{ text: '  },', variant: 'default' },
		{ text: '  images: {', variant: 'default' },
		{ text: '    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],', variant: 'default' },
		{ text: '  },', variant: 'default' },
		{ text: '}', variant: 'default' },
	];
}
