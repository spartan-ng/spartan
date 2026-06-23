import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCheck,
	lucideClipboard,
	lucideCopy,
	lucideFileCode,
	lucideLock,
	lucideLockOpen,
	lucideRotateCcw,
	lucideRotateCw,
	lucideShare2,
	lucideShuffle,
	lucideTerminal,
	lucideUpload,
	lucideX,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import {
	BASE_COLORS,
	COLOR_THEMES,
	DesignSystemConfig,
	FONT_DEFINITIONS,
	ICON_LIBRARIES,
	MENU_ACCENTS,
	MENU_COLORS,
	STYLES,
} from '@spartan-ng/registry';
import { DesignSystemService, type LockableParam } from '../lib/design-system.service';
import { ActionMenu } from './action-menu';
import { MainMenu } from './main-menu';
import { OpenPresetDialog } from './open-preset';
import { ProjectForm } from './project-form';

@Component({
	selector: 'spartan-customizer',
	imports: [
		HlmButton,
		HlmCardImports,
		HlmSeparatorImports,
		NgIcon,
		OpenPresetDialog,
		MainMenu,
		ProjectForm,
		ActionMenu,
	],
	providers: [
		provideIcons({
			lucideCheck,
			lucideClipboard,
			lucideCopy,
			lucideFileCode,
			lucideLock,
			lucideLockOpen,
			lucideRotateCcw,
			lucideRotateCw,
			lucideShare2,
			lucideShuffle,
			lucideTerminal,
			lucideUpload,
			lucideX,
		}),
	],
	template: `
		<div
			hlmCard
			class="bg-card/90 top-24 right-12 isolate z-10 max-h-full min-h-0 w-full self-start rounded-2xl backdrop-blur-xl"
		>
			<div class="flex items-center justify-between border-b p-4">
				<h2 class="text-sm font-semibold">Customize</h2>
				<div class="flex items-center gap-1">
					<button
						hlmBtn
						variant="ghost"
						size="icon-xs"
						(click)="_ds.undo()"
						[disabled]="!_ds.canUndo()"
						title="Undo (Ctrl+Z)"
					>
						<ng-icon name="lucideRotateCcw" size="14" />
					</button>
					<button
						hlmBtn
						variant="ghost"
						size="icon-xs"
						(click)="_ds.redo()"
						[disabled]="!_ds.canRedo()"
						title="Redo (Ctrl+Shift+Z)"
					>
						<ng-icon name="lucideRotateCw" size="14" />
					</button>
					<spartan-main-menu />
				</div>
			</div>

			<div hlmCardContent class="no-scrollbar min-h-0 flex-1 overflow-hidden overflow-x-auto md:overflow-y-auto">
				<div class="flex flex-row gap-2.5 py-px md:flex-col md:gap-3.25">
					<div class="flex items-end gap-2">
						<div class="flex-1 space-y-2">
							<label class="text-sm font-medium">Style</label>
							<select
								[value]="_ds.state().style"
								(change)="_onStyleChange($event)"
								class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
							>
								@for (s of _styles; track s) {
									<option [value]="s" [selected]="_ds.state().style === s">{{ s }}</option>
								}
							</select>
						</div>
						<button hlmBtn variant="ghost" size="icon-xs" (click)="_toggleLock('style')" title="Lock Style">
							<ng-icon [name]="_ds.isLocked('style') ? 'lucideLock' : 'lucideLockOpen'" size="14" />
						</button>
					</div>

					<hlm-separator class="hidden md:block" />

					<div class="flex items-end gap-2">
						<div class="flex-1 space-y-2">
							<label class="text-sm font-medium">Base Color</label>
							<select
								[value]="_ds.state().baseColor"
								(change)="_onBaseColorChange($event)"
								class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
							>
								@for (c of _baseColors; track c) {
									<option [value]="c" [selected]="_ds.state().baseColor === c">{{ c }}</option>
								}
							</select>
						</div>
						<button hlmBtn variant="ghost" size="icon-xs" (click)="_toggleLock('baseColor')" title="Lock Base Color">
							<ng-icon [name]="_ds.isLocked('baseColor') ? 'lucideLock' : 'lucideLockOpen'" size="14" />
						</button>
					</div>

					<div class="flex items-end gap-2">
						<div class="flex-1 space-y-2">
							<label class="text-sm font-medium">Theme</label>
							<select
								[value]="_ds.state().theme"
								(change)="_onThemeChange($event)"
								class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
							>
								<optgroup label="Base">
									@for (t of _baseThemes; track t) {
										<option [value]="t" [selected]="_ds.state().theme === t">{{ _themeLabel(t) }}</option>
									}
								</optgroup>
								<optgroup label="Colors">
									@for (t of _colorThemes; track t) {
										<option [value]="t" [selected]="_ds.state().theme === t">{{ _themeLabel(t) }}</option>
									}
								</optgroup>
							</select>
						</div>
						<button hlmBtn variant="ghost" size="icon-xs" (click)="_toggleLock('theme')" title="Lock Theme">
							<ng-icon [name]="_ds.isLocked('theme') ? 'lucideLock' : 'lucideLockOpen'" size="14" />
						</button>
					</div>

					<div class="flex items-end gap-2">
						<div class="flex-1 space-y-2">
							<label class="text-sm font-medium">Chart Color</label>
							<select
								[value]="_ds.state().chartColor"
								(change)="_onChartColorChange($event)"
								class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
							>
								<optgroup label="Base">
									@for (t of _baseThemes; track t) {
										<option [value]="t" [selected]="_ds.state().chartColor === t">{{ _themeLabel(t) }}</option>
									}
								</optgroup>
								<optgroup label="Colors">
									@for (t of _colorThemes; track t) {
										<option [value]="t" [selected]="_ds.state().chartColor === t">{{ _themeLabel(t) }}</option>
									}
								</optgroup>
							</select>
						</div>
						<button hlmBtn variant="ghost" size="icon-xs" (click)="_toggleLock('chartColor')" title="Lock Chart Color">
							<ng-icon [name]="_ds.isLocked('chartColor') ? 'lucideLock' : 'lucideLockOpen'" size="14" />
						</button>
					</div>

					<hlm-separator class="hidden md:block" />

					<div class="flex items-end gap-2">
						<div class="flex-1 space-y-2">
							<label class="text-sm font-medium">Font (Body)</label>
							<select
								[value]="_ds.state().font"
								(change)="_onFontChange($event)"
								class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
							>
								@for (f of _fonts; track f.value) {
									<option [value]="f.value" [selected]="_ds.state().font === f.value">{{ f.label }}</option>
								}
							</select>
						</div>
						<button hlmBtn variant="ghost" size="icon-xs" (click)="_toggleLock('font')" title="Lock Font">
							<ng-icon [name]="_ds.isLocked('font') ? 'lucideLock' : 'lucideLockOpen'" size="14" />
						</button>
					</div>

					<div class="flex items-end gap-2">
						<div class="flex-1 space-y-2">
							<label class="text-sm font-medium">Font (Heading)</label>
							<select
								[value]="_ds.state().fontHeading"
								(change)="_onFontHeadingChange($event)"
								class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
							>
								<option value="inherit">Inherit ({{ _bodyFontLabel() }})</option>
								@for (f of _fonts; track f.value) {
									<option [value]="f.value" [selected]="_ds.state().fontHeading === f.value">{{ f.label }}</option>
								}
							</select>
						</div>
						<button
							hlmBtn
							variant="ghost"
							size="icon-xs"
							(click)="_toggleLock('fontHeading')"
							title="Lock Heading Font"
						>
							<ng-icon [name]="_ds.isLocked('fontHeading') ? 'lucideLock' : 'lucideLockOpen'" size="14" />
						</button>
					</div>

					<hlm-separator class="hidden md:block" />

					<div class="flex items-end gap-2">
						<div class="flex-1 space-y-2">
							<label class="text-sm font-medium">Icon Library</label>
							<select
								[value]="_ds.state().iconLibrary"
								(change)="_onIconLibraryChange($event)"
								class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
							>
								@for (icon of _iconLibraries; track icon) {
									<option [value]="icon" [selected]="_ds.state().iconLibrary === icon">{{ icon }}</option>
								}
							</select>
						</div>
						<button
							hlmBtn
							variant="ghost"
							size="icon-xs"
							(click)="_toggleLock('iconLibrary')"
							title="Lock Icon Library"
						>
							<ng-icon [name]="_ds.isLocked('iconLibrary') ? 'lucideLock' : 'lucideLockOpen'" size="14" />
						</button>
					</div>

					<div class="flex items-end gap-2">
						<div class="flex-1 space-y-2">
							<label class="text-sm font-medium">Radius</label>
							<select
								[value]="_ds.state().radius"
								(change)="_onRadiusChange($event)"
								class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
							>
								@for (r of _ds.availableRadii(); track r.name) {
									<option [value]="r.name" [selected]="_ds.state().radius === r.name">{{ r.label }}</option>
								}
							</select>
						</div>
						<button hlmBtn variant="ghost" size="icon-xs" (click)="_toggleLock('radius')" title="Lock Radius">
							<ng-icon [name]="_ds.isLocked('radius') ? 'lucideLock' : 'lucideLockOpen'" size="14" />
						</button>
					</div>

					<hlm-separator class="hidden md:block" />

					<div class="flex items-end gap-2">
						<div class="flex-1 space-y-2">
							<label class="text-sm font-medium">Menu Accent</label>
							<select
								[value]="_ds.state().menuAccent"
								(change)="_onMenuAccentChange($event)"
								class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
							>
								@for (a of _menuAccents; track a) {
									<option [value]="a" [selected]="_ds.state().menuAccent === a">{{ a }}</option>
								}
							</select>
						</div>
						<button hlmBtn variant="ghost" size="icon-xs" (click)="_toggleLock('menuAccent')" title="Lock Menu Accent">
							<ng-icon [name]="_ds.isLocked('menuAccent') ? 'lucideLock' : 'lucideLockOpen'" size="14" />
						</button>
					</div>

					<div class="flex items-end gap-2">
						<div class="flex-1 space-y-2">
							<label class="text-sm font-medium">Menu Color</label>
							<select
								[value]="_ds.state().menuColor"
								(change)="_onMenuColorChange($event)"
								class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
							>
								@for (c of _menuColors; track c) {
									<option [value]="c" [selected]="_ds.state().menuColor === c">{{ c }}</option>
								}
							</select>
						</div>
						<button hlmBtn variant="ghost" size="icon-xs" (click)="_toggleLock('menuColor')" title="Lock Menu Color">
							<ng-icon [name]="_ds.isLocked('menuColor') ? 'lucideLock' : 'lucideLockOpen'" size="14" />
						</button>
					</div>
				</div>
			</div>

			<div class="flex min-w-0 flex-col gap-2 p-6 pt-0 md:flex-col">
				<button hlmBtn size="sm" class="w-full" (click)="_openProjectForm.set(true)">
					<ng-icon name="lucideFileCode" class="mr-2" size="14" />
					Get Code
				</button>
			</div>
		</div>

		<spartan-open-preset-dialog
			[open]="_openPresetOpen()"
			(openChange)="_openPresetOpen.set($event)"
			(apply)="_ds.applyPresetCode($event)"
		/>
		<spartan-project-form [open]="_openProjectForm()" (openChange)="_openProjectForm.set($event)" />
		<spartan-action-menu [open]="_actionMenuOpen()" (openChange)="_actionMenuOpen.set($event)" />
	`,
})
export class Customizer {
	protected readonly _ds = inject(DesignSystemService);

	protected readonly _styles = STYLES;
	protected readonly _baseColors = BASE_COLORS;
	protected readonly _baseThemes = BASE_COLORS;
	protected readonly _colorThemes = COLOR_THEMES;
	protected readonly _iconLibraries = ICON_LIBRARIES;
	protected readonly _fonts = FONT_DEFINITIONS;
	protected readonly _menuAccents = MENU_ACCENTS;
	protected readonly _menuColors = MENU_COLORS;

	protected readonly _openPresetOpen = signal(false);
	protected readonly _openProjectForm = signal(false);
	protected readonly _actionMenuOpen = signal(false);

	protected readonly _bodyFontLabel = computed(() => {
		const font = this._ds.state().font;
		const def = FONT_DEFINITIONS.find((f) => f.value === font);
		return def?.label ?? font;
	});

	protected _themeLabel(name: string): string {
		return name.charAt(0).toUpperCase() + name.slice(1);
	}

	protected _toggleLock(param: LockableParam): void {
		this._ds.toggleLock(param);
	}

	protected _onStyleChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this._ds.update({ style: value as DesignSystemConfig['style'] });
	}

	protected _onBaseColorChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this._ds.update({ baseColor: value as DesignSystemConfig['baseColor'] });
	}

	protected _onThemeChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this._ds.update({ theme: value as DesignSystemConfig['theme'] });
	}

	protected _onChartColorChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this._ds.update({ chartColor: value as DesignSystemConfig['chartColor'] });
	}

	protected _onFontChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this._ds.update({ font: value as DesignSystemConfig['font'] });
	}

	protected _onFontHeadingChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this._ds.update({ fontHeading: value as DesignSystemConfig['fontHeading'] });
	}

	protected _onIconLibraryChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this._ds.update({ iconLibrary: value as DesignSystemConfig['iconLibrary'] });
	}

	protected _onRadiusChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this._ds.update({ radius: value as DesignSystemConfig['radius'] });
	}

	protected _onMenuAccentChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this._ds.update({ menuAccent: value as DesignSystemConfig['menuAccent'] });
	}

	protected _onMenuColorChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		this._ds.update({ menuColor: value as DesignSystemConfig['menuColor'] });
	}
}
