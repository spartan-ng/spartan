import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'spartan-sidebar-preview',
	template: `
		<img [src]="'/assets/' + name() + '.png'" [alt]="name()" class="border-border flex rounded border md:hidden" />

		<div class="relative hidden aspect-[4/2.5] w-full overflow-hidden rounded-md border md:block">
			<div class="bg-background absolute inset-0 hidden w-[1600px] md:block">
				<iframe [src]="_iframeSrc()" class="size-full"></iframe>
			</div>
		</div>
	`,
})
export class SidebarPreview {
	private readonly _sanitizer = inject(DomSanitizer);
	public readonly name = input.required<string>();
	protected readonly _iframeSrc = computed(() =>
		this._sanitizer.bypassSecurityTrustResourceUrl('/sidebar-preview/' + this.name()),
	);
}
