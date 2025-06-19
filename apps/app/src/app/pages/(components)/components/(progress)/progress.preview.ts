import { Component, type OnInit } from '@angular/core';
import { BrnProgressComponent, BrnProgressIndicatorComponent } from '@spartan-ng/brain/progress';
import { HlmProgressDirective, HlmProgressIndicatorDirective } from '@spartan-ng/helm/progress';

@Component({
	selector: 'spartan-progress-preview',
	imports: [BrnProgressComponent, BrnProgressIndicatorComponent, HlmProgressIndicatorDirective, HlmProgressDirective],
	template: `
		<brn-progress hlm class="w-80" aria-labelledby="loading" [value]="value">
			<brn-progress-indicator hlm />
		</brn-progress>
	`,
})
export class ProgressPreviewComponent implements OnInit {
	public value = 15;

	ngOnInit() {
		setTimeout(() => (this.value = 65), 2000);
	}
}

export const defaultCode = `
import { Component, OnInit } from '@angular/core';
import {
  BrnProgressComponent,
  BrnProgressIndicatorComponent,
} from '@spartan-ng/brain/progress';
import { HlmProgressDirective, HlmProgressIndicatorDirective } from '@spartan-ng/helm/progress';

@Component({
  selector: 'spartan-progress-preview',
imports: [BrnProgressComponent, BrnProgressIndicatorComponent, HlmProgressIndicatorDirective, HlmProgressDirective],
  template: \`
    <brn-progress hlm class='w-80' aria-labelledby="loading" [value]="value">
      <brn-progress-indicator hlm />
    </brn-progress>
  \`,
})
export class ProgressPreviewComponent implements OnInit {
  value = 15;

  ngOnInit() {
    setTimeout(() => (this.value = 65), 3000);
  }
}
`;

export const defaultImports = `
import {
  BrnProgressComponent,
  BrnProgressIndicatorComponent,
} from '@spartan-ng/brain/progress';
import { HlmProgressDirective, HlmProgressIndicatorDirective } from '@spartan-ng/helm/progress';
`;
export const defaultSkeleton = `
<brn-progress hlm [value]="value">
   <brn-progress-indicator hlm />
</brn-progress>
`;
