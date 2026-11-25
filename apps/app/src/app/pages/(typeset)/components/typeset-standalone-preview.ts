import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TYPESET_CHAT_QUESTION } from '../typeset-fixtures';
import { TypesetFontService } from '../typeset-font.service';
import {
	parseTypesetState,
	typesetFixtureHtml,
	typesetMeasureWidth,
	typesetPreviewStyles,
} from '../typeset-preview.util';

/**
 * Renders a typeset fixture with the preset from the query string and nothing else.
 * Used by the standalone `/preview/typeset/<item>` routes, which hide the docs
 * chrome so the page matches what consumers get in their own app.
 */
@Component({
	selector: 'spartan-typeset-standalone-preview',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'typeset-preview-page block min-h-svh bg-background',
	},
	template: `
		<div class="flex min-h-svh justify-center px-6 pt-8 pb-24 md:pt-24 md:pb-32">
			<div class="flex w-full flex-col" [style.max-width]="_measureWidth()">
				@if (_isChat()) {
					<div class="bg-muted ms-auto mb-10 w-fit max-w-[65%] rounded-3xl px-4 py-2.5">
						{{ _chatQuestion }}
					</div>
				}
				<div class="typeset" [style]="_styles()" [innerHTML]="_html()"></div>
			</div>
		</div>
	`,
})
export class TypesetStandalonePreview {
	private readonly _route = inject(ActivatedRoute);
	private readonly _sanitizer = inject(DomSanitizer);
	private readonly _fonts = inject(TypesetFontService);

	public readonly item = input.required<string>();

	private readonly _queryParams = toSignal(this._route.queryParamMap, {
		initialValue: this._route.snapshot.queryParamMap,
	});

	protected readonly _chatQuestion = TYPESET_CHAT_QUESTION;
	protected readonly _state = computed(() => parseTypesetState(this._queryParams(), this.item()));
	protected readonly _styles = computed(() => typesetPreviewStyles(this._state()));
	protected readonly _measureWidth = computed(() => typesetMeasureWidth(this._state()));
	protected readonly _isChat = computed(() => this._state().item === 'chat');
	protected readonly _html = computed<SafeHtml>(() =>
		this._sanitizer.bypassSecurityTrustHtml(typesetFixtureHtml(this._state().item)),
	);

	constructor() {
		effect(() => {
			const state = this._state();
			this._fonts.load([state.body, state.heading === 'inherit' ? state.body : state.heading, state.mono]);
		});
	}
}
