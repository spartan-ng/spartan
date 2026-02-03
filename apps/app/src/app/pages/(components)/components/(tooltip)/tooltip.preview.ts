import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-tooltip-preview',
	imports: [HlmTooltipImports, HlmButtonImports],
	template: `
		<button hlmTooltip="Add to library" hlmBtn variant="outline">Default</button>
	`,
})
export class TooltipPreview {}

export const defaultImports = `
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
`;
export const defaultSkeleton = `<button hlmTooltip="Add to library"  hlmBtn variant="outline">Default</button>`;
