import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-item-preview',
	imports: [HlmSpinnerImports, HlmItemImports, HlmButtonImports, HlmProgressImports],
	template: `
		<div class="flex w-full max-w-md flex-col gap-4 [--radius:1rem]">
			<div hlmItem variant="outline">
				<hlm-item-media variant="icon">
					<hlm-spinner />
				</hlm-item-media>
				<hlm-item-content>
					<hlm-item-title>Downloading...</hlm-item-title>
					<p hlmItemDescription>129 MB / 1000 MB</p>
				</hlm-item-content>
				<hlm-item-actions class="hidden sm:flex">
					<button hlmBtn variant="outline" size="sm">Cancel</button>
				</hlm-item-actions>
				<hlm-item-footer>
					<hlm-progress value="75">
						<hlm-progress-indicator />
					</hlm-progress>
				</hlm-item-footer>
			</div>
		</div>
	`,
})
export class SpartanSpinnerItemPreview {}
