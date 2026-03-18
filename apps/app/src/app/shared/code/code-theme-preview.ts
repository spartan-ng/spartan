import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { StyleService } from '@spartan-ng/app/app/shared/style.service';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'div[spartanStyleCodePreview]',
	imports: [HlmSelectImports],
	providers: [
		provideIcons({
			lucideInfo,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="border-border flex flex-row items-center justify-between border-b p-4">
			<hlm-select class="inline-block" [(value)]="_styleService.style" [itemToString]="itemToString">
				<hlm-select-trigger class="w-52">
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						@for (style of styles; track style.value) {
							<hlm-select-item [value]="style.value">
								{{ style.label }}
							</hlm-select-item>
						}
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select>
		</div>
		<div
			class="preview style-{{
				_styleService.style()
			}} flex min-h-[350px] w-full items-center justify-center px-4 py-10 lg:px-10"
			[attr.data-style]="_styleService.style()"
		>
			<ng-content />
		</div>
	`,
})
export class CodeStylePreview {
	protected readonly _styleService = inject(StyleService);

	styles = [
		{ value: 'vega', label: 'Vega' },
		{ value: 'nova', label: 'Nova' },
		{ value: 'maia', label: 'Maia' },
		{ value: 'lyra', label: 'Lyra' },
		{ value: 'mira', label: 'Mira' },
	];

	itemToString = (value: string) => this.styles.find((style) => style.value === value)?.label ?? '';
}
