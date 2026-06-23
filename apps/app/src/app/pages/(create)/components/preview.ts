import { Component, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayoutDashboard, lucideMonitor, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { DesignSystemService } from '../lib/design-system.service';

@Component({
	selector: 'spartan-preview',
	imports: [HlmButton, NgIcon],
	providers: [provideIcons({ lucideMonitor, lucideMoon, lucideSun, lucideLayoutDashboard })],
	template: `
		<div
			class="ring-foreground/10 md:ring-muted dark:ring-foreground/10 relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl ring"
		>
			<div class="flex items-center justify-between gap-2 px-3 py-2">
				<div class="flex items-center gap-1">
					<button
						hlmBtn
						variant="outline"
						size="xs"
						[class.bg-muted]="_previewItem() === 'preview-01'"
						(click)="_previewItem.set('preview-01')"
					>
						Preview 01
					</button>
					<button
						hlmBtn
						variant="outline"
						size="xs"
						[class.bg-muted]="_previewItem() === 'preview-02'"
						(click)="_previewItem.set('preview-02')"
					>
						Preview 02
					</button>
				</div>
				<div class="flex items-center gap-1">
					<button
						hlmBtn
						variant="ghost"
						size="icon-xs"
						(click)="_ds.darkMode.set(!_ds.darkMode())"
						[title]="_ds.darkMode() ? 'Switch to Light (D)' : 'Switch to Dark (D)'"
					>
						<ng-icon [name]="_ds.darkMode() ? 'lucideMoon' : 'lucideSun'" size="14" />
					</button>
				</div>
			</div>
			<div class="relative z-0 mx-auto flex w-full flex-1 flex-col overflow-hidden">
				<div class="bg-muted dark:bg-muted/30 absolute inset-0"></div>
				<iframe [src]="_iframeSrc()" class="z-10 size-full flex-1" title="Preview"></iframe>
			</div>
		</div>
	`,
})
export class Preview {
	private readonly _ds = inject(DesignSystemService);
	private readonly _sanitizer = inject(DomSanitizer);

	protected readonly _previewItem = signal('preview-01');

	protected readonly _iframeSrc = computed(() => {
		const params = this._ds.state();
		const preset = this._ds.presetCode();
		const base = 'nova';
		const item = this._previewItem();
		const darkMode = this._ds.darkMode() ? '1' : '0';
		const url = `/preview/${base}/${item}?preset=${preset}&style=${params.style}&baseColor=${params.baseColor}&theme=${params.theme}&iconLibrary=${params.iconLibrary}&font=${params.font}&fontHeading=${params.fontHeading}&radius=${params.radius}&menuAccent=${params.menuAccent}&menuColor=${params.menuColor}&darkMode=${darkMode}`;
		return this._sanitizer.bypassSecurityTrustResourceUrl(url);
	});

	constructor() {
		effect(() => {
			const iframe = document.querySelector<HTMLIFrameElement>('iframe');
			if (!iframe?.contentWindow) return;
			const params = this._ds.state();
			const preset = this._ds.presetCode();
			iframe.contentWindow.postMessage(
				{
					type: 'design-system-params',
					data: {
						style: params.style,
						baseColor: params.baseColor,
						theme: params.theme,
						chartColor: params.chartColor,
						iconLibrary: params.iconLibrary,
						font: params.font,
						fontHeading: params.fontHeading,
						radius: params.radius,
						menuAccent: params.menuAccent,
						menuColor: params.menuColor,
						presetCode: preset,
						darkMode: this._ds.darkMode(),
					},
				},
				'*',
			);
		});
	}
}
