import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
	selector: 'spartan-separator-preview',
	imports: [HlmSeparatorImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex max-w-sm flex-col gap-4 text-sm">
			<div class="flex flex-col gap-1.5">
				<div class="leading-none font-medium">spartan/ui</div>
				<div class="text-muted-foreground">An open-source UI component library.</div>
			</div>
			<hlm-separator />
			<div>A set of beautifully designed components that you can customize, extend, and build on.</div>
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
