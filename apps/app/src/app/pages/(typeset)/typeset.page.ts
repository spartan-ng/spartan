import type { RouteMeta } from '@analogjs/router';
import { afterNextRender, ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { TypesetCustomizer } from './components/typeset-customizer';
import { TypesetPreview } from './components/typeset-preview';
import { TypesetStore } from './typeset.store';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Typeset' },
	meta: metaWith('spartan - Typeset', 'Typography for markdown you do not control.'),
	title: 'spartan - Typeset',
};

@Component({
	selector: 'spartan-typeset-builder',
	imports: [TypesetCustomizer, TypesetPreview],
	providers: [TypesetStore],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	template: `
		<div class="mx-auto flex w-full max-w-screen-2xl flex-col px-4 py-4 lg:px-6">
			@if (_ready()) {
				<div class="flex min-h-0 flex-col-reverse gap-4 md:h-[calc(100svh-var(--header-height)-2rem)] md:flex-row">
					<aside class="flex w-full shrink-0 flex-col md:min-h-0 md:w-64 xl:w-72">
						<spartan-typeset-customizer />
					</aside>
					<spartan-typeset-preview />
				</div>
			} @else {
				<div
					aria-hidden="true"
					class="bg-muted/40 h-[65svh] w-full animate-pulse rounded-2xl md:h-[calc(100svh-var(--header-height)-2rem)]"
				></div>
			}
		</div>
	`,
})
export default class TypesetBuilderPage {
	/** The builder reads the URL and loads fonts; render it after hydration so SSR and the client agree. */
	protected readonly _ready = signal(false);

	constructor() {
		afterNextRender(() => this._ready.set(true));
	}
}
