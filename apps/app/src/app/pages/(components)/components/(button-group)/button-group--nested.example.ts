import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroup } from '@spartan-ng/helm/button-group';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-group-nested',
	imports: [NgIcon, HlmIcon, HlmButton, HlmButtonGroup],
	providers: [
		provideIcons({
			lucideArrowRight,
			lucideArrowLeft,
		}),
	],
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
				<button hlmBtn variant="outline" size="icon-sm">
					<ng-icon hlm name="lucideArrowLeft" size="sm" />
				</button>
				<button hlmBtn variant="outline" size="icon-sm">
					<ng-icon hlm name="lucideArrowRight" size="sm" />
				</button>
			</div>
		</div>
	`,
})
export class ButtonGroupNested {}
