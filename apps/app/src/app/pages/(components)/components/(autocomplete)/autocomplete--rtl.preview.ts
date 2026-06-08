import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';

@Component({
	selector: 'spartan-autocomplete-rtl-preview',
	imports: [HlmAutocompleteImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-autocomplete [(search)]="search" [attr.dir]="_dir()" [itemToString]="_itemToString">
			<hlm-autocomplete-input [placeholder]="_t()['placeholder']" />
			<hlm-autocomplete-content *hlmAutocompletePortal [attr.dir]="_dir()">
				<hlm-autocomplete-empty>{{ _t()['empty'] }}</hlm-autocomplete-empty>
				<div hlmAutocompleteList>
					@for (option of filteredOptions(); track option) {
						<hlm-autocomplete-item [value]="option">
							{{ _t()[option] }}
						</hlm-autocomplete-item>
					}
				</div>
			</hlm-autocomplete-content>
		</hlm-autocomplete>
	`,
})
export class AutocompleteRtlPreview {
	private readonly _language = inject(TranslateService).language;

	private readonly _keys = [
		'apple',
		'banana',
		'cherry',
		'fig',
		'grape',
		'kiwi',
		'lemon',
		'mango',
		'orange',
		'peach',
		'pear',
		'strawberry',
		'watermelon',
	];

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				placeholder: 'Search fruits',
				empty: 'No fruits found.',
				apple: 'Apple',
				banana: 'Banana',
				cherry: 'Cherry',
				fig: 'Fig',
				grape: 'Grape',
				kiwi: 'Kiwi',
				lemon: 'Lemon',
				mango: 'Mango',
				orange: 'Orange',
				peach: 'Peach',
				pear: 'Pear',
				strawberry: 'Strawberry',
				watermelon: 'Watermelon',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				placeholder: 'ابحث عن الفواكه',
				empty: 'لم يتم العثور على فواكه.',
				apple: 'تفاحة',
				banana: 'موزة',
				cherry: 'كرز',
				fig: 'تين',
				grape: 'عنب',
				kiwi: 'كيوي',
				lemon: 'ليمون',
				mango: 'مانجو',
				orange: 'برتقال',
				peach: 'خوخ',
				pear: 'كمثرى',
				strawberry: 'فراولة',
				watermelon: 'بطيخ',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				placeholder: 'חפש פירות',
				empty: 'לא נמצאו פירות.',
				apple: 'תפוח',
				banana: 'בננה',
				cherry: 'דובדבן',
				fig: 'תאנה',
				grape: 'ענב',
				kiwi: 'קיווי',
				lemon: 'לימון',
				mango: 'מנגו',
				orange: 'תפוז',
				peach: 'אפרסק',
				pear: 'אגס',
				strawberry: 'תות שדה',
				watermelon: 'אבטיח',
			},
		},
	};

	public readonly search = signal('');

	protected readonly _itemToString = (key: string) => this._t()[key] ?? key;

	public readonly filteredOptions = computed(() => {
		const t = this._t();
		const search = this.search().toLowerCase();
		return this._keys.filter((key) => t[key].toLowerCase().includes(search));
	});

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation()!.values);
	protected readonly _dir = computed(() => this._translation()!.dir);
}
