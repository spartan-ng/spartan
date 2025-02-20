import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-icon-preview',
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

@Component({
	selector: 'spartan-icon-preview',
	standalone: true,
	imports: [HlmIconDirective],
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
`;

export const defaultSkeleton = `
<ng-icon hlm size='sm' name="lucideChevronRight" />
`;
