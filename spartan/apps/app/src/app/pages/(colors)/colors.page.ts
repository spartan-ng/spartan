import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideRocket } from '@ng-icons/lucide';
import { ApiDocsService } from '../../core/services/api-docs.service';
import { metaWith } from '../../shared/meta/meta.util';
import { ColorPalette } from './color-palette';
import { getColors } from './colors';

const lead = 'text-foreground max-w-3xl text-base text-balance sm:text-lg';

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan/ui - Colors',
		'The complete Tailwind color palette in HEX, RGB, HSL, CSS variables, and classes. Ready to copy and paste into your project.',
	),
	data: {
		breadcrumb: 'Colors',
	},
	title: 'spartan/ui - Colors',
};

@Component({
	selector: 'spartan-components',
	imports: [ColorPalette],
	providers: [provideIcons({ lucideRocket }), ApiDocsService],
	template: `
		<section class="flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
			<div class="mx-auto flex max-w-[64rem] flex-col items-center gap-4">
				<h1
					class="text-primary leading-tighter max-w-4xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter"
				>
					Tailwind Colors in Every Format
				</h1>
				<p class="${lead} max-w-[42rem]">
					The complete Tailwind color palette in HEX, RGB, HSL, CSS variables, and classes. Ready to copy and paste into
					your project.
				</p>
			</div>
		</section>

		<div class="container-wrapper">
			<div class="container py-6">
				<section id="colors scroll-mt-20">
					<div class="grid gap-8 lg:gap-16 xl:gap-20">
						@for (palette of _palettes; track palette.name) {
							<spartan-color-palette [colorPalette]="palette" />
						}
					</div>
				</section>
			</div>
		</div>
	`,
})
export default class ColorsPage {
	protected readonly _palettes = getColors();
}
