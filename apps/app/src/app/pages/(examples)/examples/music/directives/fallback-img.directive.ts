import { Directive, ElementRef, Renderer2, inject, input } from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'img[fallback]',
	host: {
		'(error)': 'updateUrl()',
	},
})
export class FallbackImageDirective {
	public fallback = input('');

	public imgComponent = inject(ElementRef) as ElementRef<HTMLImageElement>;
	public renderer = inject(Renderer2);

	updateUrl() {
		this.renderer.setAttribute(this.imgComponent.nativeElement, 'src', this.fallback());
		this.renderer.addClass(this.imgComponent.nativeElement, 'fallback-img');
	}
}
