import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon } from '@ng-icons/lucide';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenu, HlmMenuImports } from '@spartan-ng/helm/menu';
import { type DarkMode, ThemeService } from '../theme.service';

@Component({
	selector: 'spartan-dark-mode',
	imports: [BrnMenuTrigger, HlmMenuImports, HlmButton, NgIcon, HlmIcon, AsyncPipe, HlmMenu],
	providers: [provideIcons({ lucideMoon })],
	template: `
		<button size="sm" variant="ghost" align="end" [brnMenuTriggerFor]="theme" hlmBtn>
			<ng-icon hlm name="lucideMoon" size="sm" />
			<span class="sr-only">Open menu to change theme</span>
		</button>
		<ng-template #theme>
			<hlm-menu class="w-40">
				<button hlmMenuItemCheckbox [checked]="(theme$ | async) === 'light'" (click)="setTheme('light')">
					<hlm-menu-item-check />
					Light
				</button>
				<button hlmMenuItemCheckbox [checked]="(theme$ | async) === 'dark'" (click)="setTheme('dark')">
					<hlm-menu-item-check />
					Dark
				</button>
				<button hlmMenuItemCheckbox [checked]="(theme$ | async) === 'system'" (click)="setTheme('system')">
					<hlm-menu-item-check />
					System
				</button>
			</hlm-menu>
		</ng-template>
	`,
})
export class HeaderDarkMode {
	private readonly _themeService = inject(ThemeService);
	public theme$ = this._themeService.darkMode$;
	public setTheme(theme: DarkMode) {
		this._themeService.setDarkMode(theme);
	}
}
