import { Component, signal } from '@angular/core';
import { HlmSliderComponent } from '@spartan-ng/ui-slider-helm';

@Component({
	selector: 'spartan-slider-preview',
	imports: [HlmSliderComponent],
	template: `
		<hlm-slider [(value)]="value" />
	`,
	styles: `
		:host {
			display: block;
			width: 60%;
		}
	`,
})
export class SliderPreviewComponent {
	public readonly value = signal(50);
}

export const defaultCode = `import { Component, signal } from '@angular/core';
import { HlmSliderComponent } from '@spartan-ng/ui-slider-helm';

@Component({
	selector: 'spartan-slider-preview',
	imports: [HlmSliderComponent],
	template: \`
			<hlm-slider [(value)]="value" />
	\`,
})
export class SliderPreviewComponent {
	public readonly value = signal(50);
}}
`;

export const defaultImports = `
import { HlmSliderComponent } from '@spartan-ng/ui-slider-helm';
`;
export const defaultSlider = `
<hlm-slider />
`;
