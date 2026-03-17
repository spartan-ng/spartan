import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { StyleService } from '@spartan-ng/app/app/shared/style.service';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'div[spartanStyleCodePreview]',
	imports: [],
	providers: [
		provideIcons({
			lucideInfo,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="border-border flex flex-row items-center justify-between border-b p-4"></div>
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
