import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

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
