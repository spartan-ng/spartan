import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-button-with-icon',
	imports: [HlmButtonDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideMail })],
	template: `
		<button hlmBtn>
			<ng-icon hlm size="sm" class="mr-2" name="lucideMail" />
			Login with Email
		</button>
	`,
})
export class ButtonWithIconComponent {}

export const withIconCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideMail } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-button-with-icon',
  standalone: true,
  imports: [HlmButtonDirective, HlmIconDirective],
  providers: [provideIcons({ lucideMail })],
  template: \`
    <button hlmBtn>
      <ng-icon hlm size="sm" class="mr-2" name="lucideMail" />
      Login with Email
    </button>
  \`,
})
export class ButtonWithIconComponent {}
`;
