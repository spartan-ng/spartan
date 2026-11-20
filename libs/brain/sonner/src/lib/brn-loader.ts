// Adapted from Sonner (https://github.com/emilkowalski/sonner), MIT License, Copyright (c) 2023 Emil Kowalski,
// via ngx-sonner (https://github.com/tutkli/ngx-sonner), MIT License, Copyright (c) 2024 Clara Castillo.
import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'brn-sonner-loader',
	exportAs: 'brnSonnerLoader',
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
