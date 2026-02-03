import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideBot, lucideChevronDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-button-group-popover',
	imports: [HlmIconImports, HlmInputImports, HlmButtonImports, HlmButtonGroupImports, HlmPopoverImports],
	providers: [provideIcons({ lucideChevronDown, lucideBot })],
	template: `
		<hlm-popover sideOffset="5" align="end">
			<div hlmButtonGroup>
				<button hlmBtn variant="outline">
					<ng-icon hlm name="lucideBot" size="sm" />
					Copilot
				</button>
				<button id="edit-profile" variant="outline" hlmPopoverTrigger hlmBtn variant="outline" size="icon">
					<ng-icon hlm name="lucideChevronDown" size="sm" />
				</button>
				<hlm-popover-content class="rounded-xl p-0 text-sm" *hlmPopoverPortal="let ctx">
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
				</hlm-popover-content>
			</div>
		</hlm-popover>
	`,
})
export class ButtonGroupPopover {}
