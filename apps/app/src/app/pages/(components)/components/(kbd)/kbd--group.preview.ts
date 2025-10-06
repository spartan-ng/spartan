import { Component } from '@angular/core';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

@Component({
	selector: 'spartan-kbd-group-preview',
	imports: [HlmKbdImports],
	template: `
		<div class="flex flex-col items-center gap-4">
			<p class="text-muted-foreground text-sm">
				Use
				<kbd hlmKbdGroup>
					<kbd hlmKbd>Ctrl + B</kbd>
					<kbd hlmKbd>Ctrl + K</kbd>
				</kbd>
				to open the command palette
			</p>
		</div>
	`,
})
export class KbdGroupPreview {}
