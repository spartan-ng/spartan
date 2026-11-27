import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { TYPESET_CHAT_QUESTION } from '../typeset-fixtures';
import { TypesetStore } from '../typeset.store';
import { TYPESET_CONTENT_OPTIONS } from '../typeset.types';

@Component({
	selector: 'spartan-typeset-preview',
	imports: [HlmButton, NgIcon, HlmTooltipImports],
	providers: [provideIcons({ lucideExternalLink })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		// The builder places this in a fixed-height row on md+. On smaller screens it keeps a
		// readable viewport height and the customizer sits below it.
		class:
			'relative flex h-[65svh] w-full flex-col overflow-hidden rounded-2xl bg-background ring-1 ring-foreground/10 md:h-auto md:min-h-0 md:flex-1',
	},
	template: `
		<div class="min-h-0 flex-1 overflow-y-auto">
			<div class="mx-auto w-full px-5 py-10 md:px-10 md:py-14">
				@if (_isChat()) {
					<div class="mx-auto mb-8 flex w-full flex-col gap-6" [style.max-width]="_measureWidth()">
						<div class="bg-primary text-primary-foreground ms-auto max-w-[85%] rounded-2xl px-4 py-2.5 text-sm">
							{{ _chatQuestion }}
						</div>
					</div>
				}

				<div class="typeset mx-auto" [style]="_styles()" [innerHTML]="_html()"></div>
			</div>
		</div>

		<div
			class="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t to-transparent"
		></div>

		<div class="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center">
			<div
				class="dark bg-card/90 pointer-events-auto flex items-center gap-1 rounded-xl p-1 shadow-xl backdrop-blur-xl"
			>
				@for (option of _items; track option.value; let index = $index) {
					<button
						hlmBtn
						variant="ghost"
						size="sm"
						type="button"
						class="text-muted-foreground hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground h-7 min-w-7 rounded-lg px-2 text-xs font-medium transition-colors"
						[attr.data-active]="_item() === option.value"
						[attr.aria-label]="option.label"
						[hlmTooltip]="option.label"
						position="top"
						(click)="_setItem(option.value)"
					>
						{{ _number(index) }}
					</button>
				}
			</div>
			<div
				class="dark bg-card/90 pointer-events-auto ms-1.5 flex items-center gap-1 rounded-xl p-1 shadow-xl backdrop-blur-xl"
			>
				<a
					hlmBtn
					variant="ghost"
					size="sm"
					class="text-muted-foreground hover:text-foreground h-7 gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors"
					[href]="_previewHref()"
					target="_blank"
					rel="noreferrer"
				>
					<ng-icon name="lucideExternalLink" class="size-3.5" />
					<span class="max-md:sr-only">Open in New Tab</span>
				</a>
			</div>
		</div>
	`,
})
export class TypesetPreview {
	private readonly _store = inject(TypesetStore);
	private readonly _sanitizer = inject(DomSanitizer);

	protected readonly _chatQuestion = TYPESET_CHAT_QUESTION;
	protected readonly _items = TYPESET_CONTENT_OPTIONS;
	protected readonly _styles = this._store.previewStyles;
	protected readonly _measureWidth = this._store.previewMeasure;

	protected readonly _item = computed(() => this._store.state().item);
	protected readonly _isChat = computed(() => this._item() === 'chat');

	protected readonly _html = computed<SafeHtml>(() => this._sanitizer.bypassSecurityTrustHtml(this._store.fixture()));

	/** Standalone preview URL carrying every current preset value. */
	protected readonly _previewHref = computed(() => {
		const state = this._store.state();
		const params = new URLSearchParams({
			body: state.body,
			heading: state.heading,
			mono: state.mono,
			scale: state.scale,
			measure: state.measure,
			flow: state.flow,
			leading: state.leading,
		});
		return `/preview/typeset/${state.item}?${params.toString()}`;
	});

	protected _setItem(value: string): void {
		this._store.setItem(value);
	}

	protected _number(index: number): string {
		return String(index + 1).padStart(2, '0');
	}
}
