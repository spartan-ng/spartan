import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
	selector: 'spartan-page-nav-link',
	imports: [RouterLink],

	template: `
		<a
			[routerLink]="[]"
			[relativeTo]="_activatedRoute"
			[fragment]="fragment"
			class="text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-[0.8rem] no-underline transition-colors data-[depth=3]:pl-4 data-[depth=4]:pl-6"
		>
			{{ label }}
		</a>
	`,
})
export class PageNavLink {
	protected readonly _activatedRoute = inject(ActivatedRoute);
	@Input()
	public fragment = '';
	@Input()
	public label = '';
}
