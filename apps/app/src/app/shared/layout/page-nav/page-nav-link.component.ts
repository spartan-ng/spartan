import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'spartan-page-nav-link',
	imports: [RouterLink, RouterLinkActive],
	host: {
		class: 'mt-0 pt-2',
		role: 'listitem',
	},
	template: `
		<a
			[routerLink]="[]"
			[relativeTo]="activatedRoute"
			[fragment]="fragment"
			class="hover:text-foreground text-muted-foreground focus-visible:ring-ring inline-block rounded no-underline transition-colors focus-visible:outline-none focus-visible:ring-2"
		>
			{{ label }}
		</a>
	`,
})
export class PageNavLinkComponent {
	protected activatedRoute = inject(ActivatedRoute);
	@Input()
	public fragment = '';
	@Input()
	public label = '';
}
