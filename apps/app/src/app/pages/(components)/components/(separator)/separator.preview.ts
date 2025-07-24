import { Component } from '@angular/core';
import { BrnSeparator } from '@spartan-ng/brain/separator';
import { HlmSeparator } from '@spartan-ng/helm/separator';

@Component({
	selector: 'spartan-separator-preview',
	imports: [HlmSeparator, BrnSeparator],
	template: `
		<div>
			<div class="space-y-1">
				<h4 class="text-sm font-medium leading-none">Radix Primitives</h4>
				<p class="text-muted-foreground text-sm">An open-source UI component library.</p>
			</div>
			<brn-separator hlmSeparator class="my-4" />
			<div class="flex h-5 items-center space-x-4 text-sm">
				<div>Blog</div>
				<brn-separator decorative hlmSeparator orientation="vertical" />
				<div>Docs</div>
				<brn-separator decorative hlmSeparator orientation="vertical" />
				<div>Source</div>
			</div>
		</div>
	`,
})
export class SeparatorPreview {}

export const defaultImports = `
import { HlmSeparatorDirective } from '@spartan-ng/helm/separator';
import { BrnSeparatorComponent } from '@spartan-ng/brain/separator';
`;
export const defaultSkeleton = `
<brn-separator hlmSeparator/>
`;
