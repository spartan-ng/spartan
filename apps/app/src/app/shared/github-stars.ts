import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideStar } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { GithubRepoService } from '../core/services/github-repo-service';

@Component({
	selector: 'github-stars',
	imports: [NgIcon, HlmIcon],
	host: {
		class: 'flex items-center gap-1',
	},
	template: `
		@if (_githubStars().githubStarsCount) {
			<span class="text-xs">
				{{ _githubStars().githubStarsCountFormatted }}
			</span>
		}
		@if (starIcon()) {
			<ng-icon hlm size="sm" [class.ml-2]="!_githubStars().githubStarsCount" name="lucideStar" />
		}
	`,
	providers: [provideIcons({ lucideStar })],
})
export class GithubStars {
	public readonly starIcon = input<boolean, BooleanInput>(false, { transform: coerceBooleanProperty });

	private readonly _githubRepoService = inject(GithubRepoService);
	protected readonly _githubStars = computed(() => this._githubRepoService.githubStars());
}
