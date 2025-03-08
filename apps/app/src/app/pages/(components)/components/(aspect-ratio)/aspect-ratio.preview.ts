import { Component } from '@angular/core';
import { HlmAspectRatioDirective } from '@spartan-ng/ui-aspectratio-helm';

@Component({
	selector: 'spartan-aspect-ratio-preview',
	imports: [HlmAspectRatioDirective],
	template: `
		<div class="max-w-xl overflow-hidden rounded-xl drop-shadow">
			<div [hlmAspectRatio]="16 / 9">
				<img alt="Mountain views" src="/assets/mountains.jpg" />
			</div>
		</div>
	`,
})
export class AspectRatioPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmAspectRatioDirective } from '@spartan-ng/ui-aspectratio-helm';

@Component({
  selector: 'spartan-aspect-ratio-preview',
  standalone: true,
  imports: [HlmAspectRatioDirective],
  template: \`
    <div class="max-w-xl overflow-hidden rounded-xl drop-shadow">
      <div [hlmAspectRatio]="16 / 9">
        <img alt="Mountain views" src="/mountains.jpg" />
      </div>
    </div>
  \`,
})
export class AspectRatioPreviewComponent {}
`;

export const defaultImports = `
import { HlmAspectRatioDirective } from '@spartan-ng/ui-aspectratio-helm';
`;

export const defaultSkeleton = `
<div class="max-w-xl overflow-hidden rounded-xl drop-shadow">
  <div [hlmAspectRatio]="ratio">
    <img alt="Mountain views" src="/mountains.jpg" />
  </div>
</div>
`;
