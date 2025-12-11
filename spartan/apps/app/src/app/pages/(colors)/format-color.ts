import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '@spartan-ng/app/app/pages/(colors)/colors';

export function getColorFormat(color: Color) {
	return {
		class: `bg-${color.name}-100`,
		hex: color.hex,
		rgb: color.rgb,
		hsl: color.hsl,
		oklch: color.oklch,
		var: `--color-${color.name}-${color.scale}`,
	};
}

export type ColorFormat = keyof ReturnType<typeof getColorFormat>;

@Pipe({
	name: 'formatColor',
})
export class FormatColorPipe implements PipeTransform {
	transform(color: Color): ReturnType<typeof getColorFormat> {
		return getColorFormat(color);
	}
}
