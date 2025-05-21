import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-icon',
	imports: [HlmButtonDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<button hlmBtn size="icon" variant="outline"><ng-icon hlm size="sm" name="lucideChevronRight" /></button>
	`,
})
export class ButtonIconComponent {}

export const iconCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmSpinnerComponent } from '@spartan-ng/helm/spinner';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-button-icon',
  standalone: true,
  imports: [HlmButtonDirective, HlmSpinnerComponent, HlmIconDirective],
  providers: [provideIcons({ lucideChevronRight })],
  template: \` <button hlmBtn size="icon" variant="outline"><ng-icon hlm size='sm' name="lucideChevronRight" /></button> \`,
})
export class ButtonIconComponent {}
`;
