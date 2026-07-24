import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmResizableImports } from '@spartan-ng/helm/resizable';

@Component({
	selector: 'spartan-resizable-example',
	imports: [HlmResizableImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-xs' },
	template: `
		<hlm-resizable-group class="max-w-md rounded-lg border">
			<hlm-resizable-panel defaultSize="50">
				<div class="flex h-[200px] items-center justify-center p-6">
					<span class="font-semibold">One</span>
				</div>
			</hlm-resizable-panel>
			<hlm-resizable-handle withHandle />
			<hlm-resizable-panel defaultSize="50">
				<hlm-resizable-group direction="vertical">
					<hlm-resizable-panel defaultSize="25">
						<div class="flex h-full items-center justify-center p-6">
							<span class="font-semibold">Two</span>
						</div>
					</hlm-resizable-panel>
					<hlm-resizable-handle withHandle />
					<hlm-resizable-panel defaultSize="75">
						<div class="flex h-full items-center justify-center p-6">
							<span class="font-semibold">Three</span>
						</div>
					</hlm-resizable-panel>
				</hlm-resizable-group>
			</hlm-resizable-panel>
		</hlm-resizable-group>
	`,
})
export class ResizablePreviewComponent {}

export const defaultImports = `
import { HlmResizableImports } from '@spartan-ng/helm/resizable';
`;

export const defaultSkeleton = `
<hlm-resizable-group class="h-[200px] w-[500px] max-w-md rounded-lg border">
  <hlm-resizable-panel>
    <div class="flex h-full items-center justify-center p-6">One</div>
  </hlm-resizable-panel>
  <hlm-resizable-handle />
  <hlm-resizable-panel>
    <hlm-resizable-group direction="vertical">
      <hlm-resizable-panel>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Two</span>
        </div>
      </hlm-resizable-panel>
      <hlm-resizable-handle />
      <hlm-resizable-panel>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Three</span>
        </div>
      </hlm-resizable-panel>
    </hlm-resizable-group>
  </hlm-resizable-panel>
</hlm-resizable-group>
`;
