import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmToggleDirective } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-outline',
	imports: [BrnToggleDirective, HlmToggleDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button brnToggle hlm variant="outline">
			<ng-icon hlm size="sm" name="lucideItalic" />
		</button>
	`,
})
export class ToggleOutlinePreviewComponent {}

export const outlineCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@spartan-ng/helm/toggle';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-toggle-outline',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconDirective],
  providers: [provideIcons({ lucideItalic })],
  template: \`
    <button brnToggle hlm variant="outline">
      <ng-icon hlm size="sm" name="lucideItalic" />
    </button>
  \`,
})
export class ToggleOutlinePreviewComponent {}

`;
