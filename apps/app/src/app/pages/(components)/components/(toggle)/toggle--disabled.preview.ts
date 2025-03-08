import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUnderline } from '@ng-icons/lucide';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';

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
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideUnderline } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-toggle-disabled',
  standalone: true,
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
