import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideChevronDown } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmTextarea } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-button-group-popover',
	imports: [HlmButtonGroupImports, HlmPopoverImports, HlmTextarea, HlmButton, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideBot, lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover sideOffset="5" align="end">
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="sm">
					<ng-icon hlm name="lucideBot" size="sm" />
					Copilot
				</button>
				<button id="edit-profile" variant="outline" hlmPopoverTrigger hlmBtn variant="outline" size="icon-sm">
					<ng-icon hlm name="lucideChevronDown" size="sm" />
				</button>
				<hlm-popover-content class="rounded-xl p-0 text-sm" *hlmPopoverPortal="let ctx">
					<div class="border-input border-b px-4 py-3">
						<div class="text-sm font-medium">Agent Tasks</div>
					</div>
					<div class="p-4 text-sm">
						<textarea
							hlmTextarea
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
