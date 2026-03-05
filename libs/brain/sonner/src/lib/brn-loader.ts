import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'brn-sonner-loader',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="sonner-loading-wrapper" [attr.data-visible]="isVisible()">
			<div class="sonner-spinner">
				@for (_ of bars; track $index) {
					<div class="sonner-loading-bar"></div>
				}
			</div>
		</div>
	`,
})
export class BrnSonnerLoader {
	isVisible = input.required({ transform: booleanAttribute });
	bars = Array(12).fill(0);
}
