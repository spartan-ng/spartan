import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'brn-sonner-loader',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="sonner-loading-wrapper" [attr.data-visible]="isVisible()">
			<div class="sonner-spinner">
				@for (_ of _bars; track $index) {
					<div class="sonner-loading-bar"></div>
				}
			</div>
		</div>
	`,
})
export class BrnSonnerLoader {
	public readonly isVisible = input.required<boolean, BooleanInput>({ transform: booleanAttribute });
	protected readonly _bars = Array(12).fill(0);
}
