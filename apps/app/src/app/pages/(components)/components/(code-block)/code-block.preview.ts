import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideWrapText } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

@Component({
	selector: 'spartan-code-block-preview',
	imports: [HlmCodeBlockImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideDownload, lucideWrapText })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-lg">
			<hlm-code-block>
				<hlm-code-block-header>
					<hlm-code-block-title>app/api/chat/route.ts</hlm-code-block-title>
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
						<button hlmBtn variant="ghost" size="icon-xs" aria-label="Download" (click)="_download(_code, 'route.ts')">
							<ng-icon name="lucideDownload" />
						</button>
						<button hlmCodeBlockCopyButton [value]="_code"></button>
					</hlm-code-block-actions>
				</hlm-code-block-header>
				<pre hlmCodeBlockContent [code]="_code" [wrap]="_wrap()"></pre>
			</hlm-code-block>
		</div>
	`,
})
export class CodeBlockPreview {
	protected readonly _wrap = signal(false);

	protected readonly _code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    system: "You are a helpful assistant. Answer in one short paragraph.",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`;

	protected _download(value: string, filename: string): void {
		const url = URL.createObjectURL(new Blob([value], { type: 'text/plain' }));
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.click();
		URL.revokeObjectURL(url);
	}
}

export const defaultImports = `
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';
`;

export const defaultSkeleton = `
<hlm-code-block>
  <hlm-code-block-header>
    <hlm-code-block-title>Terminal</hlm-code-block-title>
    <hlm-code-block-actions>
      <button hlmCodeBlockCopyButton [value]="output"></button>
    </hlm-code-block-actions>
  </hlm-code-block-header>
  <pre hlmCodeBlockContent [code]="output"></pre>
</hlm-code-block>
`;
