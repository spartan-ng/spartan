import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert, lucideZap } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import type { GeneratedProject } from './stackblitz-project-builder.service';
import { StackBlitzProjectBuilderService } from './stackblitz-project-builder.service';
import { StackBlitzService } from './stackblitz.service';

/**
 * Opens a docs example in a runnable StackBlitz project. Pass the example source via
 * `code`; everything needed (helm modules, deps, theme) is derived from it by the builder.
 */
@Component({
	selector: 'spartan-stackblitz-button',
	imports: [HlmButton, NgIcon, HlmTooltipImports],
	providers: [provideIcons({ lucideZap, lucideTriangleAlert })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button
			hlmBtn
			variant="ghost"
			size="icon-xs"
			type="button"
			[hlmTooltip]="_tooltip()"
			(click)="open()"
			aria-label="Open in StackBlitz"
		>
			<ng-icon [name]="_failed() ? 'lucideTriangleAlert' : 'lucideZap'" />
		</button>
	`,
})
export class OpenInStackBlitzButton {
	private readonly _builder = inject(StackBlitzProjectBuilderService);
	private readonly _stackblitz = inject(StackBlitzService);

	/** The example component source to run. */
	public readonly code = input<string | null | undefined>();
	/** Optional title for the StackBlitz project (e.g. the component name). */
	public readonly title = input<string>('spartan/ui example');

	/** Briefly flips to an error state after a failed open, so the click is not silently ignored. */
	protected readonly _failed = signal(false);
	protected readonly _tooltip = computed(() => (this._failed() ? 'Could not open - try again' : 'Open in StackBlitz'));

	/** Lazily fetched once - the generated project artifact is large (~400KB). */
	private static _generated: Promise<GeneratedProject> | null = null;

	protected async open(): Promise<void> {
		const code = this.code();
		if (!code) return;
		// Reset the cache if the fetch fails so a transient error doesn't poison every later click.
		OpenInStackBlitzButton._generated ??= Promise.all([
			fetch('/data/stackblitz-project.json').then((r) => {
				if (!r.ok) throw new Error(`Failed to load StackBlitz project (${r.status})`);
				return r.json() as Promise<GeneratedProject>;
			}),
			// A 404 (artifact genuinely absent) maps to {}, but a network failure is allowed to
			// propagate so the outer catch resets the cache and the next click can retry - rather
			// than caching an empty map that keeps multi-file examples broken until reload.
			fetch('/data/stackblitz-example-files.json').then((r) =>
				r.ok ? (r.json() as Promise<Record<string, string>>) : ({} as Record<string, string>),
			),
		])
			.then(([project, exampleFiles]) => ({ ...project, exampleFiles }))
			.catch((error) => {
				OpenInStackBlitzButton._generated = null;
				throw error;
			});

		try {
			const generated = await OpenInStackBlitzButton._generated;
			const project = this._builder.buildProject(code, generated, this.title());
			if (!project) {
				this.indicateFailure();
				return;
			}
			await this._stackblitz.open(project);
		} catch (error) {
			console.error('Could not open this example in StackBlitz.', error);
			this.indicateFailure();
		}
	}

	private indicateFailure(): void {
		this._failed.set(true);
		setTimeout(() => this._failed.set(false), 4000);
	}
}
