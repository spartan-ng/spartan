import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';

@Component({
	selector: 'spartan-toggle-large',
	imports: [BrnToggleDirective, HlmToggleDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button size="lg" brnToggle hlm>
			<ng-icon hlm size="lg" name="lucideItalic" />
		</button>
	`,
})
export class ToggleLargePreviewComponent {}

export const largeCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-toggle-large',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconDirective],
  providers: [provideIcons({ lucideItalic })],
  template: \`
    <button size="lg" brnToggle hlm>
      <ng-icon hlm size="lg" name="lucideItalic" />
    </button>
  \`,
})
export class ToggleLargePreviewComponent {}
`;
