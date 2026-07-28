import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-bubble-popover-preview',
	imports: [HlmBubbleImports, HlmPopoverImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideInfo })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-4 py-12',
	},
	template: `
		<div hlmBubble align="end">
			<div hlmBubbleContent>Run the build script.</div>
		</div>
		<div hlmBubble variant="destructive">
			<div hlmBubbleContent>Failed to run the command.</div>
			<div hlmBubbleReactions>
				<hlm-popover sideOffset="5">
					<button
						hlmPopoverTrigger
						hlmBtn
						variant="ghost"
						size="icon-xs"
						aria-label="Show error details"
						class="aria-expanded:text-destructive"
					>
						<ng-icon name="lucideInfo" />
					</button>
					<hlm-popover-content *hlmPopoverPortal="let ctx" class="w-72">
						<hlm-popover-header>
							<div hlmPopoverTitle>Command failed with exit code 1</div>
							<p hlmPopoverDescription>ENOENT: no such file or directory, open pnpm-lock.yaml</p>
						</hlm-popover-header>
					</hlm-popover-content>
				</hlm-popover>
			</div>
		</div>
	`,
})
export class BubblePopoverPreview {}
