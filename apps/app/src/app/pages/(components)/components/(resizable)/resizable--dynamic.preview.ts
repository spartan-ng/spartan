import { Component, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmResizableImports } from '@spartan-ng/helm/resizable';

@Component({
	selector: 'spartan-resizable-dynamic-preview',
	imports: [HlmResizableImports, HlmButton],
	template: `
		<div class="flex flex-col gap-4">
			<button hlmBtn class="self-start" variant="outline" (click)="showPanel.update((visible) => !visible)">
				{{ showPanel() ? 'Remove panel' : 'Add panel' }}
			</button>

			<hlm-resizable-group class="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]" [(layout)]="layout">
				<hlm-resizable-panel defaultSize="40">
					<div class="flex h-full items-center justify-center p-6">
						<span class="font-semibold">One</span>
					</div>
				</hlm-resizable-panel>
				<hlm-resizable-handle withHandle />
				@if (showPanel()) {
					<hlm-resizable-panel defaultSize="25">
						<div class="flex h-full items-center justify-center p-6">
							<span class="font-semibold">Dynamic</span>
						</div>
					</hlm-resizable-panel>
					<hlm-resizable-handle withHandle />
				}
				<hlm-resizable-panel defaultSize="60">
					<div class="flex h-full items-center justify-center p-6">
						<span class="font-semibold">Two</span>
					</div>
				</hlm-resizable-panel>
			</hlm-resizable-group>
		</div>
	`,
})
export class ResizableDynamicPreview {
	public readonly showPanel = signal(false);
	public readonly layout = signal([40, 60]);
}
