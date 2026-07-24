import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

@Component({
	selector: 'spartan-kbd-rtl-preview',
	imports: [HlmKbdImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-col items-center gap-4" [dir]="_dir()">
			<kbd hlmKbdGroup>
				<kbd hlmKbd>⌘</kbd>
				<kbd hlmKbd>⇧</kbd>
				<kbd hlmKbd>⌥</kbd>
				<kbd hlmKbd>⌃</kbd>
			</kbd>
			<kbd hlmKbdGroup>
				<kbd hlmKbd>Ctrl</kbd>
				<span>+</span>
				<kbd hlmKbd>B</kbd>
			</kbd>
		</div>
	`,
})
export class KbdRtlPreview {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {},
		},
		ar: {
			dir: 'rtl',
			values: {},
		},
		he: {
			dir: 'rtl',
			values: {},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _dir = computed(() => this._translation().dir);
}
