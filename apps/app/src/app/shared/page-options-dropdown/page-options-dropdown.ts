import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { lucideChevronDown } from '@ng-icons/lucide';
import { remixClaudeFill, remixOpenaiFill } from '@ng-icons/remixicon';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { AiChatLinkDirective } from './ai-chat-link-directive';

@Component({
	selector: 'spartan-page-options-dropdown',
	template: `
		<button hlmBtn variant="outline" [brnMenuTriggerFor]="menu">
			AI Assist
			<ng-icon hlm name="lucideChevronDown" />
		</button>
		<ng-template #menu>
			<hlm-menu>
				<a hlmMenuItem spartanAiChatLink aiType="chatgpt">
					<ng-icon hlm name="remixOpenaiFill" />
					Open in ChatGPT
				</a>
				<a hlmMenuItem spartanAiChatLink aiType="claude">
					<ng-icon hlm name="remixClaudeFill" />
					Open in Claude
				</a>
			</hlm-menu>
		</ng-template>
	`,
	imports: [HlmMenuImports, BrnMenuTrigger, HlmButton, NgIconComponent, AiChatLinkDirective],
	providers: [provideIcons({ remixOpenaiFill, remixClaudeFill, lucideChevronDown })],
})
export class PageOptionsDropdown {}
