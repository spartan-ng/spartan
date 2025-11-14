import { KeyValuePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Color } from '@spartan-ng/app/app/pages/(colors)/color';
import { ColorPalette as ColorPaletteType } from '@spartan-ng/app/app/pages/(colors)/colors';
import { FormatColorPipe } from '@spartan-ng/app/app/pages/(colors)/format-color';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { ColorFormat } from './format-color';

@Component({
	selector: 'spartan-color-palette',
	imports: [Color, BrnSelectImports, HlmSelectImports, KeyValuePipe, FormatColorPipe, FormsModule],
	host: {
		'[id]': 'colorPalette().name',
		class: 'block scroll-mt-20 rounded-lg',
	},
	template: `
		@let palette = colorPalette();
		<div class="flex items-center px-4">
			<div class="flex-1 pl-1 text-sm font-medium">
				<h2 class="capitalize">{{ palette.name }}</h2>
			</div>
			<brn-select hlm [(ngModel)]="colorFormat">
				<hlm-select-trigger size="sm" class="bg-secondary text-secondary-foreground border-secondary shadow-none">
					<span class="font-medium">Format:</span>
					<span class="text-muted-foreground font-mono">{{ colorFormat() }}</span>
				</hlm-select-trigger>
				<hlm-select-content class="min-w-max rounded-xl">
					@for (keyValue of palette.colors[0] | formatColor | keyvalue; track keyValue) {
						<hlm-option [value]="keyValue.key">
							<span class="font-medium">{{ keyValue.key }}</span>
							<span class="text-muted-foreground font-mono text-xs">
								{{ keyValue.value }}
							</span>
						</hlm-option>
					}
				</hlm-select-content>
			</brn-select>
		</div>
		<div class="flex flex-col gap-4 py-4 sm:flex-row sm:gap-2">
			@for (color of palette.colors; track color.id) {
				<button spartanColor [color]="color" [colorFormat]="colorFormat()"></button>
			}
		</div>
	`,
})
export class ColorPalette {
	public readonly colorPalette = input.required<ColorPaletteType>();
	public readonly colorFormat = signal<ColorFormat>('oklch');
}
