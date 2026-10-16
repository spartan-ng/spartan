import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideTerminal, lucideWrapText } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

@Component({
	selector: 'spartan-code-block-actions',
	imports: [HlmCodeBlockImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideTerminal, lucideWrapText, lucideDownload })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-md">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>
						<ng-icon name="lucideTerminal" />
						Terminal
					</hlm-code-block-title>
					<hlm-code-block-actions>
						<button
							hlmBtn
							variant="ghost"
							size="icon-xs"
							aria-label="Wrap lines"
							[attr.aria-pressed]="_wrap()"
							(click)="_wrap.set(!_wrap())"
						>
							<ng-icon name="lucideWrapText" />
						</button>
						<button
							hlmBtn
							variant="ghost"
							size="icon-xs"
							aria-label="Download"
							(click)="_download(_output, 'lint.log')"
						>
							<ng-icon name="lucideDownload" />
						</button>
						<button hlmCodeBlockCopyButton [value]="_output"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="_output" [wrap]="_wrap()"></pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockActions {
	protected readonly _wrap = signal(false);

	protected readonly _output = `$ pnpm lint
apps/web/src/app/message-list.component.ts
  18:22  error    Unsafe call of an \`any\` typed value  @typescript-eslint/no-unsafe-call
  42:7   warning  'scrollToBottom' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 2 problems (1 error, 1 warning)`;

	protected _download(value: string, filename: string): void {
		const url = URL.createObjectURL(new Blob([value], { type: 'text/plain' }));
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.click();
		URL.revokeObjectURL(url);
	}
}
