import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideChevronDown } from '@ng-icons/lucide';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroup } from '@spartan-ng/helm/button-group';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-button-group-popover',
	imports: [HlmIcon, NgIcon, HlmInput, HlmButton, HlmButtonGroup, BrnPopoverImports, HlmPopoverImports],
	providers: [
		provideIcons({
			lucideChevronDown,
			lucideBot,
		}),
	],
	template: `
		<brn-popover sideOffset="5">
			<div hlmButtonGroup>
				<button hlmBtn variant="outline">
					<ng-icon hlm name="lucideBot" size="sm" />
					Copilot
				</button>
				<button id="edit-profile" variant="outline" brnPopoverTrigger hlmBtn variant="outline" size="icon">
					<ng-icon hlm name="lucideChevronDown" size="sm" />
				</button>
				<div hlmPopoverContent class="rounded-xl p-0 text-sm" *brnPopoverContent="let ctx">
					<div class="border-input border-b px-4 py-3">
						<div class="text-sm font-medium">Agent Tasks</div>
					</div>
					<div class="p-4 text-sm">
						<textarea
							hlmInput
							placeholder="Describe your task in natural language."
							class="mb-4 min-h-16 resize-none"
						></textarea>
						<p class="mb-2 font-medium">Start a new task with Copilot</p>
						<p class="text-muted-foreground">
							Describe your task in natural language. Copilot will work in the background and open a pull request for
							your review.
						</p>
					</div>
				</div>
			</div>
		</brn-popover>
	`,
})
export class ButtonGroupPopover {}
