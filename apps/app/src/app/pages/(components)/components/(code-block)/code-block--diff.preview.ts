import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

type Line = { text: string; variant: 'default' | 'added' | 'removed' };

@Component({
	selector: 'spartan-code-block-diff',
	imports: [HlmCodeBlockImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-md">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>app/greeting.component.ts</hlm-code-block-title>
					<hlm-code-block-actions>
						<button hlmCodeBlockCopyButton [value]="_code"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent>
					@for (line of _lines; track $index) {
						<span hlmCodeBlockLine [variant]="line.variant">{{ line.text }}</span>
					}
				</pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockDiff {
	protected readonly _lines: Line[] = [
		{ text: 'export class GreetingComponent {', variant: 'default' },
		{ text: '  protected readonly greeting = "Hello, " + this.name;', variant: 'removed' },
		{
			text: '  protected readonly greeting = computed(() => `Hello, ${this.name()}! Welcome back.`);',
			variant: 'added',
		},
		{ text: "  readonly name = input('Angular');", variant: 'default' },
		{ text: '}', variant: 'default' },
	];

	protected readonly _code = this._lines.map((line) => line.text).join('\n');
}
