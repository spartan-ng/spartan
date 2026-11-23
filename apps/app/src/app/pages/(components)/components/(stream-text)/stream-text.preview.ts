import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStreamTextImports } from '@spartan-ng/helm/stream-text';

const RESPONSE = `Here is a **typed** greeting helper:

\`\`\`typescript
export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\``;

@Component({
	selector: 'spartan-stream-text-preview',
	imports: [HlmStreamTextImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-96 max-w-full flex-col items-start gap-4">
			<hlm-stream-text class="min-h-32 w-full text-sm" [content]="_content()" [streaming]="_isStreaming()" />
			<button hlmBtn variant="outline" size="sm" [disabled]="_isStreaming()" (click)="_stream()">Stream</button>
		</div>
	`,
})
export class StreamTextPreview {
	protected readonly _content = signal(RESPONSE);
	protected readonly _isStreaming = signal(false);

	private _timer?: ReturnType<typeof setInterval>;

	constructor() {
		inject(DestroyRef).onDestroy(() => clearInterval(this._timer));
	}

	protected _stream(): void {
		let length = 0;
		this._isStreaming.set(true);
		this._timer = setInterval(() => {
			length += 3;
			this._content.set(RESPONSE.slice(0, length));
			if (length >= RESPONSE.length) {
				clearInterval(this._timer);
				this._isStreaming.set(false);
			}
		}, 30);
	}
}

export const defaultImports = `
import { HlmStreamTextImports } from '@spartan-ng/helm/stream-text';
`;

export const defaultSkeleton = `
<hlm-stream-text
  [content]="responseContent()"
  [streaming]="isStreaming()"
/>
`;
