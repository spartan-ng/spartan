import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';

@Component({
	selector: 'spartan-toggle-preview',
	imports: [BrnToggleDirective, HlmToggleDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button brnToggle hlm>
			<ng-icon hlm size="sm" name="lucideItalic" />
		</button>
	`,
})
export class TogglePreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
import { provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'spartan-toggle-preview',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconDirective],
  providers: [provideIcons({ lucideItalic })],
  template: \`
    <button brnToggle hlm>
      <ng-icon hlm size="sm" name="lucideItalic" />
    </button>
  \`,
})
export class TogglePreviewComponent {}
`;

export const defaultImports = `
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';
import { BrnToggleDirective } from '@spartan-ng/brain/toggle';
`;
export const defaultSkeleton = `
<button brnToggle hlm>
  <ng-icon hlm size="sm" name="lucideItalic" />
</button>
`;
