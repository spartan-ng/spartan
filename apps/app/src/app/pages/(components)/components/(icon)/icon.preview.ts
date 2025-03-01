import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-icon-preview',
	standalone: true,
	imports: [NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<div>
			<ng-icon hlm size="xl" name="lucideChevronRight" />
		</div>
	`,
})
export class IconPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
	selector: 'spartan-icon-preview',
	standalone: true,
	imports: [HlmIconDirective, NgIcon],
  providers: [provideIcons({ lucideChevronRight })],
	template: \`
    <div>
      <ng-icon hlm size='xl' name="lucideChevronRight" />
    </div>
	\`,
})
export class IconPreviewComponent {}
`;

export const defaultImports = `
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
`;

export const defaultSkeleton = `
<ng-icon hlm size='sm' name="lucideChevronRight" />
`;
