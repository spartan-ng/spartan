import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucidePlus } from '@ng-icons/lucide';
import { TranslateService } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-button-rtl-preview',
	imports: [HlmButtonImports, NgIcon, HlmSpinnerImports],
	providers: [
		provideIcons({
			lucideArrowRight,
			lucidePlus,
		}),
	],
	host: {
		class: 'flex flex-wrap items-center gap-2 md:flex-row',
		'[dir]': '_dir()',
	},
	template: `
		<button hlmBtn variant="outline">{{ _t().button }}</button>
		<button hlmBtn variant="destructive">{{ _t().delete }}</button>
		<button hlmBtn variant="outline">
			{{ _t().submit }}
			<ng-icon class="rtl:rotate-180" data-icon="inline-end" name="lucideArrowRight" />
		</button>
		<button hlmBtn variant="outline" size="icon" aria-label="Add">
			<ng-icon name="lucidePlus" />
		</button>
		<button hlmBtn variant="secondary" disabled>
			<hlm-spinner data-icon="inline-start" />
			{{ _t().loading }}
		</button>
	`,
})
export class ButtonRtlPreview {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations = {
		en: {
			dir: 'ltr',
			values: {
				button: 'Button',
				submit: 'Submit',
				delete: 'Delete',
				loading: 'Loading',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				button: 'زر',
				submit: 'إرسال',
				delete: 'حذف',
				loading: 'جاري التحميل',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				button: 'כפתור',
				submit: 'שלח',
				delete: 'מחק',
				loading: 'טוען',
			},
		},
	};
	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
