import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePalette } from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { AppThemes, type Theme, ThemeService } from '../theme.service';

@Component({
	selector: 'spartan-theme-picker',
	imports: [BrnMenuTriggerDirective, HlmMenuImports, HlmButtonDirective, NgIcon, HlmIconDirective, TitleCasePipe],
	providers: [provideIcons({ lucidePalette })],
	template: `
		<button size="sm" variant="ghost" align="end" [brnMenuTriggerFor]="themes" hlmBtn>
			<ng-icon hlm name="lucidePalette" size="sm" />
			<span class="sr-only">Open menu to change theme</span>
		</button>
		<ng-template #themes>
			<hlm-menu class="w-40">
				@for (theme of _supportedThemes; track theme) {
					<button hlmMenuItemCheckbox [checked]="_currentTheme() === theme" (click)="setTheme(theme)">
						<hlm-menu-item-check />
						{{ theme | titlecase }}
					</button>
				}
			</hlm-menu>
		</ng-template>
	`,
})
export class HeaderThemePickerComponent {
	private readonly _themeService = inject(ThemeService);
	protected readonly _currentTheme = this._themeService.theme;
	protected readonly _supportedThemes = AppThemes;
	public setTheme(theme: Theme) {
		this._themeService.setTheme(theme);
	}
}
