import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

import { tablerBrandJavascript, tablerCopy, tablerCornerDownLeft, tablerRefresh } from '@ng-icons/tabler-icons';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-input-group-textarea-preview',
	imports: [HlmInputGroupImports, HlmIconImports],
	providers: [provideIcons({ tablerBrandJavascript, tablerCopy, tablerCornerDownLeft, tablerRefresh })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'grid w-full max-w-sm gap-6' },
	template: `
		<hlm-input-group>
			<textarea
				hlmInputGroupTextarea
				id="textarea-code-32"
				placeholder="console.log('Hello, world!');"
				class="min-h-50"
			></textarea>
			<hlm-input-group-addon align="block-end" class="border-t">
				<hlm-input-group-text>Line 1, Column 1</hlm-input-group-text>
				<button hlmInputGroupButton size="sm" class="ml-auto" variant="default">
					Run
					<ng-icon name="tablerCornerDownLeft" />
				</button>
			</hlm-input-group-addon>
			<hlm-input-group-addon align="block-start" class="border-b">
				<hlm-input-group-text class="font-mono font-medium">
					<ng-icon name="tablerBrandJavascript" />
					script.js
				</hlm-input-group-text>
				<button hlmInputGroupButton class="ml-auto" size="icon-xs">
					<ng-icon name="tablerRefresh" />
				</button>
				<button hlmInputGroupButton variant="ghost" size="icon-xs">
					<ng-icon name="tablerCopy" />
				</button>
			</hlm-input-group-addon>
		</hlm-input-group>
	`,
})
export class InputGroupTextareaPreview {}
