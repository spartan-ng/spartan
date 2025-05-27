import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUnderline } from '@ng-icons/lucide';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmToggleDirective } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-disabled',
	imports: [BrnToggleDirective, HlmToggleDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideUnderline })],
	template: `
		<button disabled brnToggle hlm>
			<ng-icon hlm size="sm" name="lucideUnderline" />
		</button>
	`,
})
export class ToggleDisabledPreviewComponent {}

export const disabledCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@spartan-ng/helm/toggle';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideUnderline } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-toggle-disabled',
imports: [BrnToggleDirective, HlmToggleDirective, HlmIconDirective],
  providers: [provideIcons({ lucideUnderline })],
  template: \`
    <button disabled brnToggle hlm>
      <ng-icon hlm size="sm" name="lucideUnderline" />
    </button>
  \`,
})
export class ToggleDisabledPreviewComponent {}
`;
