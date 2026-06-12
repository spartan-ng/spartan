import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-combobox-rtl',
	imports: [HlmComboboxImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-field [attr.dir]="_dir()">
			<hlm-field-label>{{ _t()['label'] }}</hlm-field-label>
			<hlm-combobox-multiple autoHighlight [(value)]="values">
				<hlm-combobox-chips class="max-w-xs">
					<ng-template hlmComboboxValues let-values>
						@for (value of values; track $index) {
							<hlm-combobox-chip [value]="value">{{ _t()[value] }}</hlm-combobox-chip>
						}
					</ng-template>

					<input hlmComboboxChipInput [placeholder]="_t()['placeholder']" />
				</hlm-combobox-chips>
				<hlm-combobox-content *hlmComboboxPortal [attr.dir]="_dir()">
					<hlm-combobox-empty>{{ _t()['empty'] }}</hlm-combobox-empty>
					<div hlmComboboxList>
						@for (category of categories(); track category.value) {
							<hlm-combobox-item [value]="category.value">{{ category.label }}</hlm-combobox-item>
						}
					</div>
				</hlm-combobox-content>
			</hlm-combobox-multiple>
		</hlm-field>
	`,
})
export class ComboboxRtlPreview {
	public values = signal(['technology']);

	private readonly _keys = ['technology', 'design', 'business', 'marketing', 'education', 'health'];

	public readonly categories = computed(() => this._keys.map((key) => ({ value: key, label: this._t()[key] })));

	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				label: 'Categories',
				placeholder: 'Add categories',
				empty: 'No categories found.',
				technology: 'Technology',
				design: 'Design',
				business: 'Business',
				marketing: 'Marketing',
				education: 'Education',
				health: 'Health',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				label: 'الفئات',
				placeholder: 'أضف فئات',
				empty: 'لم يتم العثور على فئات.',
				technology: 'التكنولوجيا',
				design: 'التصميم',
				business: 'الأعمال',
				marketing: 'التسويق',
				education: 'التعليم',
				health: 'الصحة',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				label: 'קטגוריות',
				placeholder: 'הוסף קטגוריות',
				empty: 'לא נמצאו קטגוריות.',
				technology: 'טכנולוגיה',
				design: 'עיצוב',
				business: 'עסקים',
				marketing: 'שיווק',
				education: 'חינוך',
				health: 'בריאות',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
