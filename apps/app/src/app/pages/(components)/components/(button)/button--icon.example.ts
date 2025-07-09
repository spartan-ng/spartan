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
		<button hlmBtn size="icon" variant="secondary" class="size-8">
			<ng-icon hlm size="sm" name="lucideChevronRight" />
		</button>
	`,
})
export class ButtonIconComponent {}
