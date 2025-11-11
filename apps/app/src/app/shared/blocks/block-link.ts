import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'spartan-block-link',
	imports: [RouterLink],
	template: `
		<a
			routerLink="."
			[fragment]="fragment()"
			class="flex-1 text-center text-sm font-medium underline-offset-2 hover:underline md:flex-auto md:text-left"
		>
			<ng-content />
		</a>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockLink {
	public readonly fragment = input.required<string>();
}
