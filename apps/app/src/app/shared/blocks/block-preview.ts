import { Component, computed, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ThemeService } from '@spartan-ng/app/app/shared/theme.service';

@Component({
	selector: 'spartan-block-preview',
	template: `
		<img
			[src]="'/assets/blocks/' + name() + '.png'"
			[alt]="name()"
			class="border-border flex rounded-xl border md:hidden dark:hidden"
		/>
		<img
			[src]="'/assets/blocks/' + name() + '-dark.png'"
			[alt]="name()"
			class="border-border flex rounded-xl border not-dark:hidden md:hidden"
		/>

		<div
			class="bg-background relative hidden aspect-[4/2.5] h-[930px] overflow-hidden rounded-lg border md:block md:aspect-auto md:rounded-xl"
		>
			<iframe [src]="_iframeSrc()" class="bg-background no-scrollbar relative z-20 h-full w-full" #iframe></iframe>
		</div>
	`,
})
export class BlockPreview {
	private readonly _themeService = inject(ThemeService);
	private readonly _iframe = viewChild.required<ElementRef<HTMLIFrameElement>>('iframe');
	private readonly _sanitizer = inject(DomSanitizer);
	public readonly name = input.required<string>();
	protected readonly _iframeSrc = computed(() =>
		this._sanitizer.bypassSecurityTrustResourceUrl(`/blocks-preview/${this.name()}`),
	);

	constructor() {
		effect(() => {
			const mode = this._themeService.darkMode();
			const frame = this._iframe().nativeElement.contentDocument;
			if (frame) {
				frame.documentElement.classList.add(mode);
				switch (mode) {
					case 'dark':
						frame.documentElement.classList.remove('light');
						break;
					case 'light':
						frame.documentElement.classList.remove('dark');
						break;
				}
			}
		});
	}
}
