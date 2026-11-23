import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmStreamTextImports } from '@spartan-ng/helm/stream-text';

const CONTENT = `### Install

Run **pnpm install**, then start the app with \`pnpm dev\`:

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

- Supports lists
- And [links](https://spartan.ng)`;

@Component({
	selector: 'spartan-stream-text-markdown',
	imports: [HlmStreamTextImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-stream-text class="w-96 max-w-full text-sm" markdown [content]="_content" />
	`,
})
export class StreamTextMarkdown {
	protected readonly _content = CONTENT;
}
