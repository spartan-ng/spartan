import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookmark } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
	selector: 'spartan-toggle-rtl',
	imports: [HlmToggleImports, NgIcon],
	providers: [provideIcons({ lucideBookmark })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button
			hlmToggle
			variant="outline"
			[aria-label]="_t()['label']"
			[dir]="_dir()"
			class="data-[state=on]:*:[ng-icon]:*:[svg]:fill-foreground"
		>
			<ng-icon name="lucideBookmark" />
			{{ _t()['label'] }}
		</button>
	`,
})
export class ToggleRtlPreview {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				label: 'Bookmark',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				label: 'إشارة مرجعية',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				label: 'סימנייה',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
