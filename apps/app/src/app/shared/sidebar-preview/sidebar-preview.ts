import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'spartan-sidebar-preview',
	template: `
		<figure class="flex flex-col gap-4">
			<div class="relative aspect-[4/2.5] w-full overflow-hidden rounded-md border md:-mx-1">
				<img [src]="'/assets/sidebar-page/' + name() + '.png'" [alt]="name()" class="md:hidden dark:hidden" />
				<img [src]="'/assets/sidebar-page/' + name() + '-dark.png'" [alt]="name()" class="not-dark:hidden md:hidden" />

				<div class="bg-background absolute inset-0 hidden w-[1600px] md:block">
					<iframe [src]="_iframeSrc()" class="size-full" #iframe></iframe>
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
	public readonly name = input.required<string>();
	public readonly caption = input<string>();
	protected readonly _iframeSrc = computed(() =>
		this._sanitizer.bypassSecurityTrustResourceUrl('/sidebar-preview/' + this.name()),
	);
}
