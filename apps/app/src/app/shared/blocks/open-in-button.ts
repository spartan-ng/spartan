import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-open-in-button',
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideGithub })],
	template: `
		<a hlmBtn size="sm" [href]="url()" target="_blank">
			Open in
			<ng-icon name="lucideGithub" />
		</a>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenInButton {
	public readonly url = input.required<string>();
}
