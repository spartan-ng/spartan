import { ChangeDetectionStrategy, Component, computed, input, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFullscreen, lucideMonitor, lucideSmartphone, lucideTablet } from '@ng-icons/lucide';
import { ToggleValue } from '@spartan-ng/brain/toggle-group';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmResizableImports, HlmResizablePanel } from '@spartan-ng/helm/resizable';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { BlockLink } from './block-link';
import { BlockPreview } from './block-preview';
import { OpenInButton } from './open-in-button';

@Component({
	selector: 'spartan-block-viewer',
	imports: [
		HlmResizableImports,
		HlmToggleGroupImports,
		HlmSeparatorImports,
		HlmButtonImports,
		OpenInButton,
		BlockLink,
		BlockPreview,
		NgIcon,
	],
	providers: [provideIcons({ lucideMonitor, lucideTablet, lucideSmartphone, lucideFullscreen })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[id]': 'id()',
		class: 'flex flex-col gap-4 pt-(--header-height)',
	},
	template: `
		<!-- toolbar -->
		<div class="flex items-center justify-between gap-4 px-2 md:pr-6">
			<spartan-block-link [fragment]="id()">{{ title() }}</spartan-block-link>
			<div class="ml-auto hidden h-8 items-center gap-1.5 rounded-md border p-1 shadow-none md:flex">
				<hlm-toggle-group
					type="single"
					[(value)]="_size"
					(valueChange)="changeSize($event)"
					class="gap-1 *:data-[slot=toggle-group-item]:size-6! *:data-[slot=toggle-group-item]:rounded-sm!"
				>
					<button hlmToggleGroupItem [value]="100" title="Desktop">
						<ng-icon name="lucideMonitor" />
					</button>
					<button hlmToggleGroupItem [value]="60" title="Tablet">
						<ng-icon name="lucideTablet" />
					</button>
					<button hlmToggleGroupItem [value]="30" title="Smartphone">
						<ng-icon name="lucideSmartphone" />
					</button>
				</hlm-toggle-group>
				<hlm-separator orientation="vertical" />
				<a hlmBtn size="icon" variant="ghost" title="Open in New Tab" [href]="_previewUrl()" target="_blank">
					<span class="sr-only">Open in New Tab</span>
					<ng-icon name="lucideFullscreen" />
				</a>
			</div>

			<spartan-open-in-button [block]="block()" />
		</div>

		<!-- description -->
		<ng-content />

		<!-- resizable preview -->
		<hlm-resizable-group>
			<hlm-resizable-panel #viewerPanel="hlmResizablePanel" defaultSize="100">
				<spartan-block-preview [name]="block()" />
			</hlm-resizable-panel>
			<hlm-resizable-handle
				class="after:bg-border relative hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-8 after:w-1.5 after:translate-x-px after:-translate-y-1/2 after:rounded-full after:transition-all after:hover:h-10 md:block"
			/>
			<hlm-resizable-panel #invisiblePanel="hlmResizablePanel" defaultSize="0" minSize="0" />
		</hlm-resizable-group>
	`,
})
export class BlockViewer {
	protected readonly _viewerPanel = viewChild.required<HlmResizablePanel>('viewerPanel');
	protected readonly _invisiblePanel = viewChild.required<HlmResizablePanel>('invisiblePanel');

	public readonly block = input.required<string>();
	protected readonly _previewUrl = computed(() => `/blocks-preview/${this.block()}`);

	public readonly title = input.required<string>();
	public readonly id = input.required<string>();

	protected readonly _size = signal(100);

	public changeSize(size: ToggleValue<number>) {
		if (typeof size === 'number') {
			this._viewerPanel().setSize(size);
			this._invisiblePanel().setSize(100 - size);
		}
	}
}
