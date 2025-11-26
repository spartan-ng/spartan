import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-open-in-component-button',
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideGithub })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<a hlmBtn size="sm" [href]="_url()" target="_blank">
			Open in
			<ng-icon name="lucideGithub" />
		</a>
	`,
})
export class OpenInComponentButton {
	public readonly block = input.required<string>();

	protected readonly _url = computed(
		() =>
			`https://github.com/spartan-ng/spartan/blob/main/apps/app/src/app/pages/(blocks)/blocks/calendar/${this.block()}`,
	);
}
