import { Component } from '@angular/core';
import { HlmResizableImports } from '@spartan-ng/helm/resizable';

@Component({
	selector: 'spartan-resizable-handle-preview',
	imports: [HlmResizableImports],
	template: `
		<hlm-resizable-group class="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]">
			<hlm-resizable-panel defaultSize="25">
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Sidebar</span>
				</div>
			</hlm-resizable-panel>
			<hlm-resizable-handle withHandle />
			<hlm-resizable-panel defaultSize="75">
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Content</span>
				</div>
			</hlm-resizable-panel>
		</hlm-resizable-group>
	`,
})
export class ResizableHandlePreview {}
