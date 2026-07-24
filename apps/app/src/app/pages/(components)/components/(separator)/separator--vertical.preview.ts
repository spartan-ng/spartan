import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
	selector: 'spartan-separator-vertical',
	imports: [HlmSeparatorImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex h-5 items-center gap-4 text-sm">
			<div>Blog</div>
			<hlm-separator orientation="vertical" />
			<div>Docs</div>
			<hlm-separator orientation="vertical" />
			<div>Source</div>
		</div>
	`,
})
export class SeparatorVerticalPreview {}
