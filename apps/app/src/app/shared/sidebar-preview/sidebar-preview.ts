import { Component, computed, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StyleService } from '../style.service';

@Component({
	selector: 'spartan-sidebar-preview',
	template: `
		<figure class="flex flex-col gap-4">
			<div class="relative aspect-[4/2.5] w-full overflow-hidden rounded-md border md:-mx-1">
				<img [src]="'/assets/sidebar-page/' + name() + '.png'" [alt]="name()" class="md:hidden dark:hidden" />
				<img [src]="'/assets/sidebar-page/' + name() + '-dark.png'" [alt]="name()" class="not-dark:hidden md:hidden" />

				<div class="bg-background absolute inset-0 hidden w-[1600px] md:block">
					<iframe #iframe [src]="_iframeSrc()" class="size-full" (load)="_applyStyle()"></iframe>
				</div>
			</div>
			@if (caption(); as caption) {
				<figcaption class="text-center text-sm leading-relaxed text-gray-500">
					{{ caption }}
				</figcaption>
			}
		</figure>
	`,
})
export class SidebarPreview {
	private readonly _sanitizer = inject(DomSanitizer);
	private readonly _styleService = inject(StyleService);
	private readonly _iframe = viewChild<ElementRef<HTMLIFrameElement>>('iframe');

	public readonly name = input.required<string>();
	public readonly caption = input<string>();

	protected readonly _iframeSrc = computed(() =>
		this._sanitizer.bypassSecurityTrustResourceUrl('/sidebar-preview/' + this.name()),
	);

	constructor() {
		// Re-apply whenever the style signal changes (the iframe stays loaded).
		effect(() => {
			this._styleService.style();
			this._applyStyle();
		});
	}

	// Also called from the iframe's (load) event so the classes survive any (re)navigation.
	protected _applyStyle(): void {
		const root = this._iframe()?.nativeElement.contentDocument?.documentElement;
		if (root === null || root === undefined) return;
		for (const cls of Array.from(root.classList)) {
			if (cls.startsWith('style-')) root.classList.remove(cls);
		}
		root.classList.add(`style-${this._styleService.style()}`);
	}
}
