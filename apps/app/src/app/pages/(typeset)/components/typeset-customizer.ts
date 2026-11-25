import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRotateCcw, lucideShuffle, lucideSunMoon } from '@ng-icons/lucide';
import { ThemeService } from '@spartan-ng/app/app/shared/theme.service';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { TYPESET_FONT_GROUPS, typesetFontFamily } from '../typeset-fonts';
import { TypesetStore } from '../typeset.store';
import { TYPESET_FLOWS, TYPESET_LEADINGS, TYPESET_MEASURES, TYPESET_SIZES } from '../typeset.types';
import { TypesetCodeSheet } from './typeset-code-sheet';
import { TypesetPicker, type TypesetPickerGroup } from './typeset-picker';

@Component({
	selector: 'spartan-typeset-customizer',
	imports: [HlmCardImports, HlmButton, NgIcon, TypesetPicker, TypesetCodeSheet],
	providers: [provideIcons({ lucideShuffle, lucideRotateCcw, lucideSunMoon })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block w-full md:flex md:min-h-0 md:flex-1 md:flex-col',
	},
	template: `
		<hlm-card
			class="bg-card/95 isolate max-h-full min-h-0 w-full self-start overflow-hidden rounded-2xl backdrop-blur-xl md:flex-1 md:self-stretch"
		>
			<div class="flex items-center justify-between gap-2 border-b px-3 py-2">
				<span class="text-sm font-medium">Customize</span>
				<div class="flex items-center gap-1">
					<button hlmBtn variant="ghost" size="icon-sm" type="button" aria-label="Shuffle" (click)="shuffle()">
						<ng-icon name="lucideShuffle" />
					</button>
					<button hlmBtn variant="ghost" size="icon-sm" type="button" aria-label="Reset" (click)="reset()">
						<ng-icon name="lucideRotateCcw" />
					</button>
					<button
						hlmBtn
						variant="ghost"
						size="icon-sm"
						type="button"
						aria-label="Toggle dark mode"
						(click)="toggleTheme()"
					>
						<ng-icon name="lucideSunMoon" />
					</button>
				</div>
			</div>

			<div
				class="no-scrollbar flex min-h-0 gap-2 overflow-x-auto px-3 py-3 md:flex-col md:overflow-x-hidden md:overflow-y-auto"
			>
				@for (picker of _pickers(); track picker.label) {
					<spartan-typeset-picker
						class="min-w-36 md:min-w-0"
						[label]="picker.label"
						[value]="picker.value"
						[groups]="picker.groups"
						[fontFamily]="picker.fontFamily"
						[icon]="picker.icon"
						[locked]="picker.locked"
						(valueChange)="picker.onChange($event)"
						(optionPreview)="picker.onPreview($event)"
						(previewClear)="_clearPreview()"
						(lockChange)="picker.onToggleLock()"
					/>
				}

				<div class="text-muted-foreground hidden px-1 pt-1 text-center font-mono text-xs tabular-nums md:block">
					{{ _sizePx() }}px / {{ _leadingPx() }}px / {{ _flowPx() }}px
				</div>
			</div>

			<div class="border-border flex items-center gap-2 border-t p-3">
				<spartan-typeset-code-sheet class="flex-1" />
			</div>
		</hlm-card>
	`,
})
export class TypesetCustomizer {
	private readonly _store = inject(TypesetStore);
	private readonly _theme = inject(ThemeService);

	protected readonly _sizePx = computed(() => Number(this._store.state().scale));
	protected readonly _leadingPx = computed(() =>
		Math.round(Number(this._store.state().scale) * Number(this._store.state().leading)),
	);
	protected readonly _flowPx = computed(() =>
		Math.round(Number(this._store.state().scale) * Number.parseFloat(this._store.state().flow)),
	);

	private readonly _fontGroups: readonly TypesetPickerGroup[] = TYPESET_FONT_GROUPS.map((group) => ({
		label: group.label,
		options: group.fonts.map((font) => ({ value: font.id, label: font.label })),
	}));

	private readonly _headingGroups = computed<TypesetPickerGroup[]>(() => [
		{ options: [{ value: 'inherit', label: `${this._store.bodyFont().label} (body)` }] },
		...this._fontGroups,
	]);

	protected readonly _pickers = computed(() => {
		const state = this._store.state();
		return [
			{
				param: 'measure' as const,
				locked: this._store.isLocked('measure'),
				onToggleLock: () => this._store.toggleLock('measure'),
				onPreview: (value: string) => this._store.previewParam('measure', value),
				icon: 'lucideMoveHorizontal',
				label: 'Measure',
				value: state.measure,
				groups: [{ options: TYPESET_MEASURES.map((option) => ({ value: option.value, label: option.label })) }],
				fontFamily: '',
				onChange: (value: string) => this._store.setMeasure(value),
			},
			{
				param: 'heading' as const,
				locked: this._store.isLocked('heading'),
				onToggleLock: () => this._store.toggleLock('heading'),
				onPreview: (value: string) => this._store.previewParam('heading', value),
				icon: '',
				label: 'Heading',
				value: state.heading,
				groups: this._headingGroups(),
				fontFamily: typesetFontFamily(this._store.headingValue()),
				onChange: (value: string) => this._store.setHeading(value),
			},
			{
				param: 'body' as const,
				locked: this._store.isLocked('body'),
				onToggleLock: () => this._store.toggleLock('body'),
				onPreview: (value: string) => this._store.previewParam('body', value),
				icon: '',
				label: 'Body',
				value: state.body,
				groups: this._fontGroups,
				fontFamily: typesetFontFamily(state.body),
				onChange: (value: string) => this._store.setBody(value),
			},
			{
				param: 'mono' as const,
				locked: this._store.isLocked('mono'),
				onToggleLock: () => this._store.toggleLock('mono'),
				onPreview: (value: string) => this._store.previewParam('mono', value),
				icon: '',
				label: 'Mono',
				value: state.mono,
				groups: this._fontGroups,
				fontFamily: typesetFontFamily(state.mono),
				onChange: (value: string) => this._store.setMono(value),
			},
			{
				param: 'scale' as const,
				locked: this._store.isLocked('scale'),
				onToggleLock: () => this._store.toggleLock('scale'),
				onPreview: (value: string) => this._store.previewParam('scale', value),
				icon: 'lucideALargeSmall',
				label: 'Size',
				value: state.scale,
				groups: [{ options: TYPESET_SIZES.map((option) => ({ value: option.value, label: option.label })) }],
				fontFamily: '',
				onChange: (value: string) => this._store.setScale(value),
			},
			{
				param: 'leading' as const,
				locked: this._store.isLocked('leading'),
				onToggleLock: () => this._store.toggleLock('leading'),
				onPreview: (value: string) => this._store.previewParam('leading', value),
				icon: 'lucideBaseline',
				label: 'Leading',
				value: state.leading,
				groups: [{ options: TYPESET_LEADINGS.map((option) => ({ value: option.value, label: option.label })) }],
				fontFamily: '',
				onChange: (value: string) => this._store.setLeading(value),
			},
			{
				param: 'flow' as const,
				locked: this._store.isLocked('flow'),
				onToggleLock: () => this._store.toggleLock('flow'),
				onPreview: (value: string) => this._store.previewParam('flow', value),
				icon: 'lucideUnfoldVertical',
				label: 'Flow',
				value: state.flow,
				groups: [{ options: TYPESET_FLOWS.map((option) => ({ value: option.value, label: option.label })) }],
				fontFamily: '',
				onChange: (value: string) => this._store.setFlow(value),
			},
		];
	});

	protected _clearPreview(): void {
		this._store.clearPreview();
	}

	protected shuffle(): void {
		this._store.shuffle();
	}

	protected reset(): void {
		this._store.reset();
	}

	protected toggleTheme(): void {
		this._theme.toggleMode();
	}
}
