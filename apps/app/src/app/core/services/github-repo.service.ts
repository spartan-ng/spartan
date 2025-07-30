import { computed, Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class GithubRepoService {
	private readonly _githubRepoData = signal<any>(null);
	public readonly githubStarsCount = computed(() => {
		const count = this._githubRepoData()?.stargazers_count ?? 0;
		if (count < 1000) return count.toString();
		// Divide by 1000, round up to the nearest tenth, and format as "k"
		const rounded = Math.ceil((count / 1000) * 10) / 10;
		return `${rounded}k`;
	});

	public setGithubData(data: any) {
		this._githubRepoData.set(data);
	}
}
