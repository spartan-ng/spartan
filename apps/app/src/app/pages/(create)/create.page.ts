import type { RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Customizer } from './components/customizer';
import { Preview } from './components/preview';
import { WelcomeDialog } from './components/welcome-dialog';
import { DesignSystemService } from './lib/design-system.service';

export const routeMeta: RouteMeta = {
	meta: metaWith('Create - spartan', 'Customize your spartan project. Pick styles, colors, fonts, and more.'),
	title: 'Create - spartan',
};

@Component({
	selector: 'spartan-create',
	imports: [Preview, Customizer, WelcomeDialog],
	template: `
		<div
			class="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden"
			style="--customizer-width: 14rem; --gap: 1rem;"
		>
			<div class="flex min-h-0 flex-1 flex-col gap-(--gap) p-(--gap) pt-[calc(var(--gap)*0.25)] md:flex-row-reverse">
				<spartan-preview />
				<spartan-customizer
					class="isolate min-h-[151px] w-full self-start rounded-2xl md:h-full md:max-h-full md:min-h-0 md:w-(--customizer-width)"
				/>
			</div>
		</div>
		<spartan-welcome-dialog />
	`,
})
export default class CreatePage {
	private readonly _ds = inject(DesignSystemService);

	constructor() {
		fromEvent<KeyboardEvent>(document, 'keydown')
			.pipe(
				takeUntilDestroyed(),
				filter((e) => !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)),
			)
			.subscribe((e) => {
				const ctrl = e.ctrlKey || e.metaKey;

				if (ctrl && e.key === 'z' && !e.shiftKey) {
					e.preventDefault();
					this._ds.undo();
					return;
				}
				if (ctrl && e.key === 'z' && e.shiftKey) {
					e.preventDefault();
					this._ds.redo();
					return;
				}
				if (ctrl && e.key === 'y') {
					e.preventDefault();
					this._ds.redo();
					return;
				}
				if (!ctrl && !e.shiftKey && e.key === 'r') {
					e.preventDefault();
					this._ds.randomize();
					return;
				}
				if (!ctrl && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
					e.preventDefault();
					this._ds.reset();
					return;
				}
				if (!ctrl && !e.shiftKey && (e.key === 'd' || e.key === 'D')) {
					e.preventDefault();
					this._ds.darkMode.update((v) => !v);
					return;
				}
				if (!ctrl && !e.shiftKey && (e.key === 'o' || e.key === 'O')) {
					e.preventDefault();
					document.querySelector<HTMLElement>('[title="Open Preset (O)"]')?.click();
					return;
				}
			});
	}
}
