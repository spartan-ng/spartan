import { Component, computed, inject, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucideTerminal } from '@ng-icons/lucide';
import type { BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { DesignSystemService } from '../lib/design-system.service';

@Component({
	selector: 'spartan-project-form',
	imports: [HlmButton, HlmDialogImports, HlmLabel, HlmSwitch, HlmTabsImports, NgIcon],
	providers: [provideIcons({ lucideCheck, lucideCopy, lucideTerminal })],
	template: `
		<hlm-dialog [state]="open()" (stateChange)="openChange.emit($event)">
			<hlm-dialog-content class="sm:max-w-lg" *hlmDialogPortal="let ctx">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>Get Code</h3>
					<p hlmDialogDescription>Use these commands to set up your project.</p>
				</hlm-dialog-header>

				<hlm-tabs tab="init" class="w-full">
					<hlm-tabs-list class="grid w-full grid-cols-3">
						<button hlmTabsTrigger="init">New Project</button>
						<button hlmTabsTrigger="apply">Existing</button>
						<button hlmTabsTrigger="theme">Theme</button>
					</hlm-tabs-list>

					<div hlmTabsContent="init" class="mt-4 space-y-4">
						<div class="flex flex-wrap gap-2">
							<button
								hlmBtn
								variant="outline"
								size="sm"
								[class.bg-muted]="_template() === 'angular'"
								(click)="_template.set('angular')"
							>
								<ng-icon name="lucideTerminal" class="mr-1" size="14" />
								Angular
							</button>
						</div>
						<div class="flex flex-wrap gap-4">
							<label class="flex items-center gap-2" hlmLabel>
								<hlm-switch [checked]="_ds.rtl()" (checkedChange)="_ds.rtl.set($event)" />
								<span class="text-sm">RTL</span>
							</label>
							<label class="flex items-center gap-2" hlmLabel>
								<hlm-switch [checked]="_ds.pointer()" (checkedChange)="_ds.pointer.set($event)" />
								<span class="text-sm">Pointer</span>
							</label>
						</div>
						<div class="bg-muted flex items-center gap-2 rounded-md p-3 text-sm">
							<code class="flex-1 font-mono text-xs break-all">{{ _initCommand() }}</code>
							<button
								hlmBtn
								variant="ghost"
								size="icon-xs"
								(click)="_copy(_initCommand())"
								[title]="_copied() ? 'Copied' : 'Copy'"
							>
								<ng-icon [name]="_copied() ? 'lucideCheck' : 'lucideCopy'" size="14" />
							</button>
						</div>
					</div>

					<div hlmTabsContent="apply" class="mt-4 space-y-4">
						<div class="bg-muted flex items-center gap-2 rounded-md p-3 text-sm">
							<code class="flex-1 font-mono text-xs break-all">{{ _applyCommand() }}</code>
							<button
								hlmBtn
								variant="ghost"
								size="icon-xs"
								(click)="_copy(_applyCommand())"
								[title]="_copied() ? 'Copied' : 'Copy'"
							>
								<ng-icon [name]="_copied() ? 'lucideCheck' : 'lucideCopy'" size="14" />
							</button>
						</div>
					</div>

					<div hlmTabsContent="theme" class="mt-4 space-y-4">
						<div class="bg-muted max-h-64 overflow-y-auto rounded-md p-3">
							<pre class="font-mono text-xs leading-relaxed">{{ _themeCss() }}</pre>
						</div>
						<button hlmBtn size="sm" class="w-full" (click)="_copy(_themeCss())">
							{{ _copied() ? 'Copied' : 'Copy Theme CSS' }}
						</button>
					</div>
				</hlm-tabs>

				<hlm-dialog-footer>
					<button hlmBtn variant="outline" hlmDialogClose>Close</button>
				</hlm-dialog-footer>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class ProjectForm {
	protected readonly _ds = inject(DesignSystemService);

	public readonly open = input<BrnDialogState>('closed');
	public readonly openChange = output<BrnDialogState>();

	protected readonly _template = signal('angular');
	protected readonly _copied = signal(false);

	protected readonly _initCommand = computed(() => {
		const preset = this._ds.presetCode();
		const rtlFlag = this._ds.rtl() ? ' --rtl' : '';
		const pointerFlag = this._ds.pointer() ? ' --pointer' : '';
		return `npx spartan init --preset ${preset}${rtlFlag}${pointerFlag}`;
	});

	protected readonly _applyCommand = computed(() => {
		const preset = this._ds.presetCode();
		return `npx spartan apply --preset ${preset}`;
	});

	protected readonly _themeCss = computed(() => {
		const config = this._ds.state();
		const style = config.style;
		const baseColor = config.baseColor;
		return `/* spartan design system - ${style}/${baseColor} */\n\n@import "tailwindcss";\n@import "@spartan-ng/helm";\n\n@layer base {\n  :root {\n    --font-sans: 'Geist', sans-serif;\n    --font-mono: 'Geist Mono', monospace;\n    --radius: 0.625rem;\n  }\n}\n`;
	});

	protected async _copy(text: string): Promise<void> {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// Clipboard not available (e.g., insecure context, prerendering)
		}
		this._copied.set(true);
		setTimeout(() => this._copied.set(false), 2000);
	}
}
