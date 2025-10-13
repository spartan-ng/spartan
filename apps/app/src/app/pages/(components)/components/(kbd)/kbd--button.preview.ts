import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

@Component({
	selector: 'spartan-kbd-button-preview',
	imports: [HlmKbdImports, HlmButtonImports],
	template: `
		<div class="flex flex-wrap items-center gap-4">
			<button hlmBtn variant="outline" size="sm" class="pr-2">
				Accept
				<kbd hlmKbd>⏎</kbd>
			</button>
			<button hlmBtn variant="outline" size="sm" class="pr-2">
				Cancel
				<kbd hlmKbd>Esc</kbd>
			</button>
		</div>
	`,
})
export class KbdButtonPreview {}
