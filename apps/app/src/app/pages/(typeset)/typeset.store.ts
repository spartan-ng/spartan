import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, type ParamMap, Router } from '@angular/router';
import { TYPESET_FIXTURES } from './typeset-fixtures';
import { TypesetFontService } from './typeset-font.service';
import { findTypesetFont, TYPESET_FONTS } from './typeset-fonts';
import { parseTypesetState, typesetMeasureWidth, typesetPreviewStyles } from './typeset-preview.util';
import {
	TYPESET_CONTENT_OPTIONS,
	TYPESET_DEFAULT_STATE,
	TYPESET_FLOWS,
	TYPESET_LEADINGS,
	TYPESET_MEASURES,
	TYPESET_SIZES,
	type TypesetLockableParam,
	type TypesetState,
} from './typeset.types';

/** Keep this in sync with `/typeset.css` and the docs page. */
const DOCS_URL = '/documentation/typeset';
const SITE_URL = 'https://www.spartan.ng';

@Injectable()
export class TypesetStore {
	private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private readonly _fonts = inject(TypesetFontService);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	private readonly _body = signal(TYPESET_DEFAULT_STATE.body);
	private readonly _heading = signal(TYPESET_DEFAULT_STATE.heading);
	private readonly _mono = signal(TYPESET_DEFAULT_STATE.mono);
	private readonly _scale = signal(TYPESET_DEFAULT_STATE.scale);
	private readonly _measure = signal(TYPESET_DEFAULT_STATE.measure);
	private readonly _flow = signal(TYPESET_DEFAULT_STATE.flow);
	private readonly _leading = signal(TYPESET_DEFAULT_STATE.leading);
	private readonly _item = signal(TYPESET_DEFAULT_STATE.item);
	private readonly _locks = signal<ReadonlySet<TypesetLockableParam>>(new Set());

	/** Uncommitted values applied while hovering a picker option. Never written to the URL. */
	private readonly _previewOverride = signal<Partial<TypesetState> | null>(null);

	public readonly state = computed<TypesetState>(() => ({
		body: this._body(),
		heading: this._heading(),
		mono: this._mono(),
		scale: this._scale(),
		measure: this._measure(),
		flow: this._flow(),
		leading: this._leading(),
		item: this._item(),
	}));

	public readonly bodyFont = computed(() => findTypesetFont(this._body()) ?? TYPESET_FONTS[0]);
	public readonly headingValue = computed(() => (this._heading() === 'inherit' ? this._body() : this._heading()));

	public readonly measure = computed(
		() => TYPESET_MEASURES.find((option) => option.value === this._measure()) ?? TYPESET_MEASURES[2],
	);

	public readonly fixture = computed(() => TYPESET_FIXTURES[this._item()] ?? TYPESET_FIXTURES['docs']);

	public isLocked(param: TypesetLockableParam): boolean {
		return this._locks().has(param);
	}

	public toggleLock(param: TypesetLockableParam): void {
		const next = new Set(this._locks());
		if (next.has(param)) {
			next.delete(param);
		} else {
			// An inherited heading follows the body font. Locking it must freeze the font the
			// user sees, so capture the current body face instead of leaving `inherit` behind.
			if (param === 'heading' && this._heading() === 'inherit') {
				this._heading.set(this._body());
			}
			next.add(param);
		}
		this._locks.set(next);
	}

	public readonly presetName = computed(() => `typeset-${this._item()}`);

	/** The committed preset plus the current hover preview, if any. */
	public readonly previewState = computed<TypesetState>(() => {
		const override = this._previewOverride();
		return override ? { ...this.state(), ...override } : this.state();
	});

	/** Variables applied to the preview wrapper (and to the generated preset). */
	public readonly previewStyles = computed(() => typesetPreviewStyles(this.previewState()));

	public readonly previewMeasure = computed(() => typesetMeasureWidth(this.previewState()));

	/** Temporary hover preview; the committed state and URL stay untouched. */
	public previewParam(param: TypesetLockableParam, value: string): void {
		this._previewOverride.set({ [param]: value } as Partial<TypesetState>);
	}

	public clearPreview(): void {
		this._previewOverride.set(null);
	}

	public readonly presetCss = computed(
		() => `.${this.presetName()} {
  --typeset-font-body: var(--font-${this._body()});
  --typeset-font-heading: var(--font-${this.headingValue()});
  --typeset-font-mono: var(--font-${this._mono()});
  --typeset-size: ${this._scale()}px;
  --typeset-leading: ${this._leading()};
  --typeset-flow: ${this._flow()};
}`,
	);

	public readonly importCss = computed(
		() => `@import "tailwindcss";
@import "./typeset.css";

${this.presetCss()}`,
	);

	public readonly usageCode = computed(
		() => `<div class="typeset ${this.presetName()} max-w-[${this.measure().width}]">
  <ng-content />
</div>`,
	);

	/** Fonts picked by the preset, deduped, in body → heading → mono order. */
	public readonly pickedFonts = computed(() => {
		const ids = [...new Set([this._body(), this.headingValue(), this._mono()])];
		return ids.map((id) => findTypesetFont(id) ?? TYPESET_FONTS[0]);
	});

	public readonly fontInstallCommand = computed(
		() =>
			`pnpm add ${this.pickedFonts()
				.map((font) => font.dependency)
				.join(' ')}`,
	);

	public readonly fontSetupCss = computed(
		() => `/* styles.css */
${this.pickedFonts()
	.map((font) => `@import '${font.dependency}';`)
	.join('\n')}

:root {
${this.pickedFonts()
	.map(
		(font) =>
			`  --font-${font.id}: '${font.cssFamily}', ${font.type === 'mono' ? 'monospace' : font.type === 'serif' ? 'serif' : 'sans-serif'};`,
	)
	.join('\n')}
}`,
	);

	public readonly prompt = computed(
		() => `Install Typeset from spartan/ui in this project.

Typeset is a single stylesheet that styles rendered markdown: wrap the output in a \`typeset\` container and everything inside (headings, lists, tables, code, blockquotes) is styled. Everything outside is untouched.

1. Download ${SITE_URL}/typeset.css and save it as typeset.css next to the project's main CSS file (where Tailwind is imported). If the file already exists, replace it with the downloaded copy.

2. Import it in the main CSS file, after the Tailwind import:

@import "./typeset.css";

3. Install and load the fonts:

${this.fontInstallCommand()}

${this.fontSetupCss().split('/* styles.css */\n')[1]}

4. Add this preset to the main CSS file, after the typeset import:

${this.presetCss()}

5. Do not apply the class anywhere yet. Search the project for surfaces that render markdown or rich content: ngx-markdown, MDX components, sanitized [innerHTML] bindings, prose classes, CMS content renderers. Present the candidates you find as a short list and ask the user which surface should use typeset. Then wrap only the surface they pick:

${this.usageCode()}

Notes:

- To exclude an embedded component from typeset styles, add the not-typeset class or the data-not-typeset attribute to it.
- Verify on the surface the user picked: headings, lists, tables, and code inside the container should be styled with no classes on the content itself.
- Docs: ${SITE_URL}${DOCS_URL}`,
	);

	constructor() {
		// Read the shared URL on both server and client so SSR renders the same preset
		// that hydration and the browser will use.
		this._applyParams(this._route.snapshot.queryParamMap);

		if (!this._isBrowser) {
			return;
		}

		// A share link or the browser's back/forward buttons can change the query string
		// without recreating the component. Mirror those changes into the store.
		this._route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => this._applyParams(params));

		effect(() => {
			this._syncUrl(this._toQueryParams(this.state()));
		});

		effect(() => {
			const state = this.previewState();
			this._fonts.load([state.body, state.heading === 'inherit' ? state.body : state.heading, state.mono]);
		});
	}

	public setBody(value: string): void {
		if (findTypesetFont(value)) this._body.set(value);
	}

	public setHeading(value: string): void {
		if (value === 'inherit' || findTypesetFont(value)) this._heading.set(value);
	}

	public setMono(value: string): void {
		if (findTypesetFont(value)) this._mono.set(value);
	}

	public setScale(value: string): void {
		if (TYPESET_SIZES.some((option) => option.value === value)) this._scale.set(value);
	}

	public setMeasure(value: string): void {
		if (TYPESET_MEASURES.some((option) => option.value === value)) this._measure.set(value);
	}

	public setFlow(value: string): void {
		if (TYPESET_FLOWS.some((option) => option.value === value)) this._flow.set(value);
	}

	public setLeading(value: string): void {
		if (TYPESET_LEADINGS.some((option) => option.value === value)) this._leading.set(value);
	}

	public setItem(value: string): void {
		if (TYPESET_CONTENT_OPTIONS.some((option) => option.value === value)) this._item.set(value);
	}

	public reset(): void {
		this.clearPreview();
		this._body.set(TYPESET_DEFAULT_STATE.body);
		this._heading.set(TYPESET_DEFAULT_STATE.heading);
		this._mono.set(TYPESET_DEFAULT_STATE.mono);
		this._scale.set(TYPESET_DEFAULT_STATE.scale);
		this._measure.set(TYPESET_DEFAULT_STATE.measure);
		this._flow.set(TYPESET_DEFAULT_STATE.flow);
		this._leading.set(TYPESET_DEFAULT_STATE.leading);
		this._item.set(TYPESET_DEFAULT_STATE.item);

		// Reset restores `inherit`, so a heading lock would no longer represent the
		// font the user saw. Drop that lock; other locks stay put.
		if (this._heading() === 'inherit' && this._locks().has('heading')) {
			const locks = new Set(this._locks());
			locks.delete('heading');
			this._locks.set(locks);
		}

		// Reset means "back to the defaults", not "defaults written into the URL".
		// Clear the sharing params even when the state was already at its defaults.
		this._syncUrl({});
	}

	public shuffle(): void {
		this.clearPreview();
		// Mirror shadcn's shuffle: body and heading draw from every non-mono face,
		// heading may inherit, and locked params keep their current value.
		const bodyFonts = TYPESET_FONTS.filter((font) => font.type !== 'mono').map((font) => font.id);
		const monoFonts = TYPESET_FONTS.filter((font) => font.type === 'mono').map((font) => font.id);
		const locks = this._locks();

		const next: Partial<TypesetState> = {
			body: pickRandom(bodyFonts),
			heading: pickRandom(['inherit', ...bodyFonts]),
			mono: pickRandom(monoFonts),
			scale: pickRandom(TYPESET_SIZES).value,
			measure: pickRandom(TYPESET_MEASURES).value,
			leading: pickRandom(TYPESET_LEADINGS).value,
			flow: pickRandom(TYPESET_FLOWS).value,
		};

		for (const param of locks) {
			delete next[param];
		}

		if (next.body) this._body.set(next.body);
		if (next.heading) this._heading.set(next.heading);
		if (next.mono) this._mono.set(next.mono);
		if (next.scale) this._scale.set(next.scale);
		if (next.measure) this._measure.set(next.measure);
		if (next.leading) this._leading.set(next.leading);
		if (next.flow) this._flow.set(next.flow);
	}

	private _applyParams(params: ParamMap): void {
		const state = parseTypesetState(params);
		this._body.set(state.body);
		this._heading.set(state.heading);
		this._mono.set(state.mono);
		this._scale.set(state.scale);
		this._measure.set(state.measure);
		this._flow.set(state.flow);
		this._leading.set(state.leading);
		this._item.set(state.item);
	}

	/** Only non-default values belong in the URL, so the default builder URL stays clean. */
	private _toQueryParams(state: TypesetState): Record<string, string> {
		const params: Record<string, string> = {};
		for (const key of Object.keys(TYPESET_DEFAULT_STATE) as (keyof TypesetState)[]) {
			if (state[key] !== TYPESET_DEFAULT_STATE[key]) {
				params[key] = state[key];
			}
		}
		return params;
	}

	private _syncUrl(queryParams: Record<string, string>): void {
		if (!this._isBrowser) return;
		untracked(() =>
			this._router.navigate([], {
				relativeTo: this._route,
				queryParams,
				replaceUrl: true,
			}),
		);
	}
}

function pickRandom<T>(items: readonly T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}
