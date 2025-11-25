import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { lucideChevronDown } from '@ng-icons/lucide';
import { remixClaudeFill, remixOpenaiFill } from '@ng-icons/remixicon';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { AiChatLinkDirective } from './ai-chat-link-directive';

@Component({
	selector: 'spartan-page-options-dropdown',
	imports: [HlmDropdownMenuImports, HlmButton, NgIconComponent, AiChatLinkDirective],
	providers: [provideIcons({ remixOpenaiFill, remixClaudeFill, lucideChevronDown })],
	template: `
		<button hlmBtn size="sm" variant="secondary" side="bottom" align="end" [hlmDropdownMenuTrigger]="menu">
			AI Assist
			<ng-icon hlm name="lucideChevronDown" />
		</button>
		<ng-template #menu>
			<hlm-dropdown-menu>
				<a hlmDropdownMenuItem spartanAiChatLink aiType="chatgpt">
					<ng-icon hlm name="remixOpenaiFill" />
					Open in ChatGPT
				</a>
				<a hlmDropdownMenuItem spartanAiChatLink aiType="claude">
					<ng-icon hlm name="remixClaudeFill" />
					Open in Claude
				</a>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class PageOptionsDropdown {}
