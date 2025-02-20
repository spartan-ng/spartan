import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
	selector: 'spartan-button-loading',
	imports: [HlmButtonDirective, HlmSpinnerComponent, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideLoaderCircle })],
	template: `
		<button disabled hlmBtn>
			<ng-icon hlm name="lucideLoaderCircle" size="sm" class="mr-2 animate-spin" />
			Please wait
		</button>
	`,
})
export class ButtonLoadingComponent {}

export const loadingCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-button-loading',
  standalone: true,
  imports: [HlmButtonDirective, HlmSpinnerComponent, HlmIconDirective],
  providers: [provideIcons({ lucideLoaderCircle })],
  template: \`
    <button disabled hlmBtn><ng-icon hlm name="lucideLoaderCircle" size="sm" class="mr-2 animate-spin" /> Please wait</button>
  \`,
})
export class ButtonLoadingComponent {}
`;
