import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGalleryHorizontal } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ThemeService } from '../theme.service';

@Component({
	selector: 'spartan-layout-mode',
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideGalleryHorizontal })],
	template: `
		<button size="sm" variant="ghost" hlmBtn (click)="_toggleLayout()">
			<ng-icon name="lucideGalleryHorizontal" />
			<span class="sr-only">Set Layout</span>
		</button>
	`,
})
export class HeaderLayoutMode {
	private readonly _themeService = inject(ThemeService);
	protected _toggleLayout(): void {
		this._themeService.setLayout(this._themeService.layout() === 'fixed' ? 'full' : 'fixed');
	}
}
