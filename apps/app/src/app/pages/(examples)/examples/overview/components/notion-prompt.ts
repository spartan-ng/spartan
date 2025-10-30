import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSeparator } from '@spartan-ng/helm/separator';

@Component({
	selector: 'spartan-notion-prompt',
	imports: [HlmInputGroupImports, HlmSeparator, HlmIcon, NgIcon],
	providers: [provideIcons({ lucideArrowUp })],
	host: { class: 'w-full' },
	template: `
		<div hlmInputGroup>
			<textarea hlmInputGroupTextarea placeholder="Ask, Search or Chat..."></textarea>
			<div hlmInputGroupAddon align="block-end">
				<button hlmInputGroupButton variant="outline" class="rounded-full" size="icon-xs">
					<ng-icon hlm name="lucidePlus" />
				</button>
				<span hlmInputGroupText class="ml-auto">52% used</span>
				<hlm-separator orientation="vertical" class="!h-4" />
				<button hlmInputGroupButton variant="default" class="rounded-full" size="icon-xs" disabled>
					<ng-icon hlm name="lucideArrowUp" />
					<span class="sr-only">Send</span>
				</button>
			</div>
		</div>
	`,
})
export class NotionPrompt {}
