import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmResizableImports } from '@spartan-ng/helm/resizable';

@Component({
	selector: 'spartan-resizable-vertical-preview',
	imports: [HlmResizableImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-xs' },
	template: `
		<hlm-resizable-group class="min-h-[200px] max-w-sm rounded-lg border" direction="vertical">
			<hlm-resizable-panel defaultSize="25">
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Header</span>
				</div>
			</hlm-resizable-panel>
			<hlm-resizable-handle />
			<hlm-resizable-panel defaultSize="75">
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Content</span>
				</div>
			</hlm-resizable-panel>
		</hlm-resizable-group>
	`,
})
export class ResizableVerticalPreview {}
