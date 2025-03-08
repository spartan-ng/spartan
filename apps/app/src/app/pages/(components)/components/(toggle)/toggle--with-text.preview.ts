import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';

@Component({
	selector: 'spartan-toggle-with-text',
	imports: [BrnToggleDirective, HlmToggleDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button brnToggle hlm>
			<ng-icon hlm size="sm" name="lucideItalic" />
			<span class="ml-2">Italic</span>
		</button>
	`,
})
export class ToggleWithTextPreviewComponent {}

export const withTextCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-toggle-with-text',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconDirective],
  providers: [provideIcons({ lucideItalic })],
  template: \`
    <button brnToggle hlm>
      <ng-icon hlm size="sm" name="lucideItalic" />
      <span class="ml-2">Italic</span>
    </button>
  \`,
})
export class ToggleWithTextPreviewComponent {}
`;
