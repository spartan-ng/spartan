import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

import { tablerBrandJavascript, tablerCopy, tablerCornerDownLeft, tablerRefresh } from '@ng-icons/tabler-icons';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-input-group-textarea-preview',
	imports: [HlmInputGroupImports, HlmIconImports],
	providers: [
		provideIcons({
			tablerBrandJavascript,
			tablerCopy,
			tablerCornerDownLeft,
			tablerRefresh,
		}),
	],
	host: {
		class: 'grid w-full max-w-sm gap-6',
	},
	template: `
		<div hlmInputGroup>
			<textarea
				hlmInputGroupTextarea
				id="textarea-code-32"
				placeholder="console.log('Hello, world!');"
				class="min-h-[200px]"
			></textarea>
			<div hlmInputGroupAddon align="block-end" class="border-t">
				<span hlmInputGroupText>Line 1, Column 1</span>
				<button hlmInputGroupButton size="sm" class="ml-auto" variant="default">
					Run
					<ng-icon name="tablerCornerDownLeft" />
				</button>
			</div>
			<div hlmInputGroupAddon align="block-start" class="border-b">
				<span hlmInputGroupText class="font-mono font-medium">
					<ng-icon name="tablerBrandJavascript" />
					script.js
				</span>
				<button hlmInputGroupButton class="ml-auto" size="icon-xs">
					<ng-icon name="tablerRefresh" />
				</button>
				<button hlmInputGroupButton variant="ghost" size="icon-xs">
					<ng-icon name="tablerCopy" />
				</button>
			</div>
		</div>
	`,
})
export class InputGroupTextareaPreview {}
