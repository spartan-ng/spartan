import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStreamTextImports } from '@spartan-ng/helm/stream-text';

const CHUNKS = [
	'Tokens often arrive in bursts. ',
	'With smooth enabled, the text is revealed at a steady pace ',
	'instead of jumping in whole chunks, ',
	'so the response reads naturally.',
];

@Component({
	selector: 'spartan-stream-text-smooth',
	imports: [HlmStreamTextImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-96 max-w-full flex-col items-start gap-4">
			<hlm-stream-text class="min-h-24 w-full text-sm" smooth [content]="_content()" [streaming]="_isStreaming()" />
			<button hlmBtn variant="outline" size="sm" [disabled]="_isStreaming()" (click)="_start()">Receive bursts</button>
		</div>
	`,
})
export class StreamTextSmooth {
	protected readonly _content = signal(CHUNKS.join(''));
	protected readonly _isStreaming = signal(false);

	protected _start(): void {
		this._content.set('');
		this._isStreaming.set(true);
		CHUNKS.forEach((chunk, index) =>
			setTimeout(
				() => {
					this._content.update((text) => text + chunk);
					if (index === CHUNKS.length - 1) {
						this._isStreaming.set(false);
					}
				},
				(index + 1) * 700,
			),
		);
	}
}
