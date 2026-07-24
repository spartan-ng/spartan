import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';

@Component({
	selector: 'spartan-button-group-nested',
	imports: [HlmButtonGroupImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideArrowLeft, lucideArrowRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmButtonGroup>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="sm">1</button>
				<button hlmBtn variant="outline" size="sm">2</button>
				<button hlmBtn variant="outline" size="sm">3</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="icon-sm">
					<ng-icon name="lucideArrowLeft" />
				</button>
				<button hlmBtn variant="outline" size="icon-sm">
					<ng-icon name="lucideArrowRight" />
				</button>
			</div>
		</div>
	`,
})
export class ButtonGroupNested {}
