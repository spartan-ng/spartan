import { computed, Directive, ElementRef, inject, OnInit } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { HlmInput, inputVariants } from '@spartan-ng/helm/input';

@Directive({
	selector: 'input[hlmSidebarInput]',

	host: {
		'data-sidebar': 'input',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarInput extends HlmInput implements OnInit {
	private readonly _element = inject<ElementRef<HTMLInputElement>>(ElementRef);

	protected override readonly _computedClass = computed(() =>
		hlm(
			inputVariants({ error: this._state().error }),
			'h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
			this.userClass(),
		),
	);

	ngOnInit() {
		if (this._element.nativeElement.tagName.toLowerCase() !== 'input') {
			console.warn('hlmSidebarInput directive should only be used on <input> elements');
		}
	}
}
