import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-loading',
	imports: [HlmButtonDirective, NgIcon, HlmIconDirective],
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
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmSpinnerComponent } from '@spartan-ng/helm/spinner';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
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
