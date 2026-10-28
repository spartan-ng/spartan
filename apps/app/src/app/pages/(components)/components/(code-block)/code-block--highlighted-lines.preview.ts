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
		{ text: '{', variant: 'default' },
		{ text: '  "projects": {', variant: 'default' },
		{ text: '    "app": {', variant: 'default' },
		{ text: '      "architect": {', variant: 'default' },
		{ text: '        "build": {', variant: 'default' },
		{ text: '          "options": {', variant: 'default' },
		{ text: '            "outputPath": "dist/app",', variant: 'highlighted' },
		{ text: '            "index": "src/index.html",', variant: 'default' },
		{ text: '            "browser": "src/main.ts"', variant: 'highlighted' },
		{ text: '          }', variant: 'default' },
		{ text: '        }', variant: 'default' },
		{ text: '      }', variant: 'default' },
		{ text: '    }', variant: 'default' },
		{ text: '  }', variant: 'default' },
		{ text: '}', variant: 'default' },
	];
}
