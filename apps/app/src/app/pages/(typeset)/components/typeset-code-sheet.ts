import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCode, lucideCopy, lucideDownload } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { TypesetStore } from '../typeset.store';

@Component({
	selector: 'spartan-typeset-code-sheet',
	imports: [HlmButton, HlmSheetImports, HlmTabsImports, NgIcon],
	providers: [provideIcons({ lucideCheck, lucideCode, lucideCopy, lucideDownload })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	template: `
		<hlm-sheet>
			<button hlmSheetTrigger side="right" hlmBtn variant="outline" type="button" class="w-full gap-2">
				<ng-icon name="lucideCode" />
				Get code
			</button>

			<hlm-sheet-content *hlmSheetPortal="let ctx" class="w-full overflow-y-auto sm:max-w-xl">
				<hlm-sheet-header class="px-6 pt-6">
					<h3 hlmSheetTitle>Get your typeset</h3>
					<p hlmSheetDescription>
						One stylesheet, the fonts you picked, and a preset class. Everything below uses your current choices.
					</p>
				</hlm-sheet-header>

				<div class="px-6 pb-8">
					<hlm-tabs [tab]="_tab()" (tabActivated)="_tab.set($event)">
						<hlm-tabs-list variant="line" class="w-full border-b">
							<button [hlmTabsTrigger]="'docs'" type="button">Docs</button>
							<button [hlmTabsTrigger]="'prompt'" type="button">Prompt</button>
						</hlm-tabs-list>

						<div [hlmTabsContent]="'docs'" class="flex flex-col gap-6 pt-5">
							<section class="flex flex-col gap-2.5">
								<h4 class="text-sm font-medium">1. Create typeset.css</h4>
								<p class="text-muted-foreground text-sm leading-relaxed">
									Copy the stylesheet into a
									<code class="font-mono">typeset.css</code>
									file next to your main CSS file, then import it.
								</p>
								<div class="flex flex-wrap gap-2">
									<button
										hlmBtn
										variant="outline"
										size="sm"
										type="button"
										class="w-fit"
										[disabled]="_loadingCss()"
										(click)="_copyTypesetCss()"
									>
										<ng-icon [name]="_copied() === 'css' ? 'lucideCheck' : 'lucideDownload'" />
										{{ _copied() === 'css' ? 'Copied' : 'Copy typeset.css' }}
									</button>
									<a href="/typeset.css" download="typeset.css" hlmBtn variant="ghost" size="sm" class="w-fit">
										Download
									</a>
								</div>
								<pre
									class="bg-muted/60 overflow-x-auto rounded-lg p-3 font-mono text-xs leading-relaxed"
								><code>{{ _importCode() }}</code></pre>
							</section>

							<section class="flex flex-col gap-2.5">
								<h4 class="text-sm font-medium">2. Add the fonts</h4>
								<p class="text-muted-foreground text-sm leading-relaxed">Install the fonts you picked:</p>
								<div class="relative">
									<pre
										class="bg-muted/60 overflow-x-auto rounded-lg p-3 pe-10 font-mono text-xs leading-relaxed"
									><code>{{ _fontInstallCommand() }}</code></pre>
									<button
										hlmBtn
										variant="ghost"
										size="icon-xs"
										type="button"
										class="absolute end-1 top-1"
										aria-label="Copy install command"
										(click)="_copy(_fontInstallCommand(), 'install')"
									>
										<ng-icon [name]="_copied() === 'install' ? 'lucideCheck' : 'lucideCopy'" />
									</button>
								</div>
								<p class="text-muted-foreground text-sm leading-relaxed">Then import them in your CSS file:</p>
								<pre
									class="bg-muted/60 overflow-x-auto rounded-lg p-3 font-mono text-xs leading-relaxed"
								><code>{{ _fontSetupCss() }}</code></pre>
							</section>

							<section class="flex flex-col gap-2.5">
								<h4 class="text-sm font-medium">3. Create your custom typeset</h4>
								<div class="relative">
									<pre
										class="bg-muted/60 overflow-x-auto rounded-lg p-3 pe-10 font-mono text-xs leading-relaxed"
									><code>{{ _importCss() }}</code></pre>
									<button
										hlmBtn
										variant="ghost"
										size="icon-xs"
										type="button"
										class="absolute end-1 top-1"
										aria-label="Copy preset"
										(click)="_copy(_importCss(), 'preset')"
									>
										<ng-icon [name]="_copied() === 'preset' ? 'lucideCheck' : 'lucideCopy'" />
									</button>
								</div>
							</section>

							<section class="flex flex-col gap-2.5">
								<h4 class="text-sm font-medium">4. Wrap your content</h4>
								<div class="relative">
									<pre
										class="bg-muted/60 overflow-x-auto rounded-lg p-3 pe-10 font-mono text-xs leading-relaxed"
									><code>{{ _usageCode() }}</code></pre>
									<button
										hlmBtn
										variant="ghost"
										size="icon-xs"
										type="button"
										class="absolute end-1 top-1"
										aria-label="Copy usage"
										(click)="_copy(_usageCode(), 'usage')"
									>
										<ng-icon [name]="_copied() === 'usage' ? 'lucideCheck' : 'lucideCopy'" />
									</button>
								</div>
							</section>
						</div>

						<div [hlmTabsContent]="'prompt'" class="flex flex-col gap-3 pt-5">
							<p class="text-muted-foreground text-sm leading-relaxed">
								One prompt with your picks baked in. Copy it and paste it into your coding agent.
							</p>
							<pre
								class="bg-muted/60 max-h-[28rem] overflow-auto rounded-lg p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap"
							><code>{{ _prompt() }}</code></pre>
							<button
								hlmBtn
								variant="outline"
								size="sm"
								type="button"
								class="w-fit"
								(click)="_copy(_prompt(), 'prompt')"
							>
								<ng-icon [name]="_copied() === 'prompt' ? 'lucideCheck' : 'lucideCopy'" />
								{{ _copied() === 'prompt' ? 'Copied' : 'Copy prompt' }}
							</button>
						</div>
					</hlm-tabs>
				</div>
			</hlm-sheet-content>
		</hlm-sheet>
	`,
})
export class TypesetCodeSheet {
	private readonly _store = inject(TypesetStore);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	protected readonly _tab = signal('docs');
	protected readonly _copied = signal<string | null>(null);
	protected readonly _loadingCss = signal(false);

	protected readonly _importCode = computed(() => `@import "tailwindcss";\n@import "./typeset.css";`);
	protected readonly _fontInstallCommand = this._store.fontInstallCommand;
	protected readonly _fontSetupCss = this._store.fontSetupCss;
	protected readonly _importCss = this._store.importCss;
	protected readonly _usageCode = this._store.usageCode;
	protected readonly _prompt = this._store.prompt;

	protected _copy(text: string, key: string): void {
		if (!this._isBrowser) return;
		void navigator.clipboard.writeText(text);
		this._flagCopied(key);
	}

	protected async _copyTypesetCss(): Promise<void> {
		if (!this._isBrowser) return;
		this._loadingCss.set(true);
		try {
			const response = await fetch('/typeset.css');
			if (!response.ok) return;
			const css = await response.text();
			await navigator.clipboard.writeText(css);
			this._flagCopied('css');
		} finally {
			this._loadingCss.set(false);
		}
	}

	private _flagCopied(key: string): void {
		this._copied.set(key);
		setTimeout(() => this._copied.set(null), 2000);
	}
}
