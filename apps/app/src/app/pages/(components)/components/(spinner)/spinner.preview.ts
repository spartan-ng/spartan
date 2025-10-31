import { Component } from '@angular/core';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-preview',
	imports: [HlmSpinnerImports, HlmItemImports],
	template: `
		<div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
			<div hlmItem variant="muted">
				<hlm-item-media>
					<hlm-spinner />
				</hlm-item-media>
				<hlm-item-content>
					<div hlmItemTitle class="line-clamp-1">Processing payment...</div>
				</hlm-item-content>
				<hlm-item-content>
					<span class="text-sm tabular-nums">$100.00</span>
				</hlm-item-content>
			</div>
		</div>
	`,
})
export class SpinnerPreview {}

export const defaultImports = `
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
`;
export const defaultSkeleton = `
<hlm-spinner class="text-base md:text-lg" />
`;
