import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch, lucideRotateCcw } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';

@Component({
	selector: 'spartan-marker-link-button-preview',
	imports: [HlmMarkerImports, NgIcon],
	providers: [provideIcons({ lucideGitBranch, lucideRotateCcw })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<a hlmMarker href="#examples__links_and_buttons">
			<span hlmMarkerIcon>
				<ng-icon name="lucideGitBranch" />
			</span>
			<span hlmMarkerContent>View the pull request</span>
		</a>
		<button hlmMarker type="button" class="hover:text-foreground transition-colors" (click)="onRevert()">
			<span hlmMarkerIcon>
				<ng-icon name="lucideRotateCcw" />
			</span>
			<span hlmMarkerContent>Revert this change</span>
		</button>
	`,
})
export class MarkerLinkButtonPreview {
	protected onRevert(): void {
		toast('You clicked the revert button');
	}
}
