import { Component } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
	selector: 'spartan-separator-preview',
	imports: [HlmSeparatorImports],
	template: `
		<div>
			<div class="space-y-1">
				<h4 class="text-sm leading-none font-medium">Radix Primitives</h4>
				<p class="text-muted-foreground text-sm">An open-source UI component library.</p>
			</div>
			<hlm-separator class="my-4" />
			<div class="flex h-5 items-center space-x-4 text-sm">
				<div>Blog</div>
				<hlm-separator orientation="vertical" />
				<div>Docs</div>
				<hlm-separator orientation="vertical" />
				<div>Source</div>
			</div>
		</div>
	`,
})
export class SeparatorPreview {}

export const defaultImports = `
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
`;
export const defaultSkeleton = `
<hlm-separator />
`;
