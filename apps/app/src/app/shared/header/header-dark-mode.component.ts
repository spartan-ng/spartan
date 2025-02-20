import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon } from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmMenuComponent, HlmMenuImports } from '@spartan-ng/ui-menu-helm';
import { type DarkMode, ThemeService } from '../theme.service';

@Component({
	selector: 'spartan-dark-mode',
	imports: [
		BrnMenuTriggerDirective,
		HlmMenuImports,
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
		AsyncPipe,
		HlmMenuComponent,
	],
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
export class HeaderDarkModeComponent {
	private readonly _themeService = inject(ThemeService);
	public theme$ = this._themeService.darkMode$;
	public setTheme(theme: DarkMode) {
		this._themeService.setDarkMode(theme);
	}
}
