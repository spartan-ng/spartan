import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';

@Component({
	selector: 'spartan-button-group-nested',
	imports: [HlmButtonImports, HlmButtonGroupImports, NgIcon],
	providers: [provideIcons({ lucideArrowRight, lucideArrowLeft })],
	template: `
		<div hlmButtonGroup>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="sm">1</button>
				<button hlmBtn variant="outline" size="sm">2</button>
				<button hlmBtn variant="outline" size="sm">3</button>
				<button hlmBtn variant="outline" size="sm">4</button>
				<button hlmBtn variant="outline" size="sm">5</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="icon-sm" aria-label="Previous">
					<ng-icon name="lucideArrowLeft" />
				</button>
				<button hlmBtn variant="outline" size="icon-sm" aria-label="Next">
					<ng-icon name="lucideArrowRight" />
				</button>
			</div>
		</div>
	`,
})
export class ButtonGroupNested {}
