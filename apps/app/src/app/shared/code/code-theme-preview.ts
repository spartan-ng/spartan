import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { StyleService } from '@spartan-ng/app/app/shared/style.service';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'div[spartanStyleCodePreview]',
	imports: [BrnSelectImports, HlmSelectImports],
	providers: [
		provideIcons({
			lucideInfo,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="border-border flex flex-row items-center justify-between border-b p-4">
			<brn-select class="inline-block" [(value)]="_styleService.style">
				<hlm-select-trigger class="w-52">
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content>
					<hlm-option value="vega">Vega</hlm-option>
					<hlm-option value="nova">Nova</hlm-option>
					<hlm-option value="maia">Maia</hlm-option>
					<hlm-option value="lyra">Lyra</hlm-option>
					<hlm-option value="mira">Mira</hlm-option>
				</hlm-select-content>
			</brn-select>
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
}
