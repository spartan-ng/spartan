import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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
	private readonly _sanitizer = inject(DomSanitizer);
	public readonly name = input.required<string>();
	protected readonly _iframeSrc = computed(() =>
		this._sanitizer.bypassSecurityTrustResourceUrl(`/blocks-preview/${this.name()}`),
	);
}
