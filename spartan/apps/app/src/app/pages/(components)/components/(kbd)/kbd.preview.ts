import { Component } from '@angular/core';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

@Component({
	selector: 'spartan-kbd-preview',
	imports: [HlmKbdImports],
	template: `
		<div class="flex flex-col items-center gap-4">
			<kbd hlmKbdGroup>
				<kbd hlmKbd>⌘</kbd>
				<kbd hlmKbd>⇧</kbd>
				<kbd hlmKbd>⌥</kbd>
				<kbd hlmKbd>⌃</kbd>
			</kbd>
			<kbd hlmKbdGroup>
				<kbd hlmKbd>Ctrl</kbd>
				<span>+</span>
				<kbd hlmKbd>B</kbd>
			</kbd>
		</div>
	`,
})
export class KbdPreview {}

export const defaultImports = `
import { HlmKbdImports } from '@spartan-ng/helm/kbd';
`;

export const defaultSkeleton = '<kbd hlmKbd>⌘</kbd>';
