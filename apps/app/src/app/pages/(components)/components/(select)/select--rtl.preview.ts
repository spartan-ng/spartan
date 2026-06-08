import { Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-rtl',
	imports: [HlmSelectImports],
	template: `
		<hlm-select [attr.dir]="_dir()" [itemToString]="itemToString">
			<hlm-select-trigger class="w-32">
				<hlm-select-value [placeholder]="_t()['selectFruit']" />
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal [attr.dir]="_dir()">
				<hlm-select-group>
					<hlm-select-label>{{ _t()['fruits'] }}</hlm-select-label>
					@for (fruit of _fruits(); track fruit.value) {
						<hlm-select-item [value]="fruit.value">{{ fruit.label }}</hlm-select-item>
					}
				</hlm-select-group>
				<hlm-select-separator />
				<hlm-select-group>
					<hlm-select-label>{{ _t()['vegetables'] }}</hlm-select-label>
					@for (vegetable of _vegetables(); track vegetable.value) {
						<hlm-select-item [value]="vegetable.value">{{ vegetable.label }}</hlm-select-item>
					}
				</hlm-select-group>
			</hlm-select-content>
		</hlm-select>
	`,
})
export class SelectRtlPreview {
	public readonly fruits = ['apple', 'banana', 'blueberry', 'grapes', 'pineapple'];
	public readonly vegetables = ['carrot', 'broccoli', 'spinach'];

	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				selectFruit: 'Select a fruit',
				fruits: 'Fruits',
				apple: 'Apple',
				banana: 'Banana',
				blueberry: 'Blueberry',
				grapes: 'Grapes',
				pineapple: 'Pineapple',
				vegetables: 'Vegetables',
				carrot: 'Carrot',
				broccoli: 'Broccoli',
				spinach: 'Spinach',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				selectFruit: 'اختر فاكهة',
				fruits: 'الفواكه',
				apple: 'تفاح',
				banana: 'موز',
				blueberry: 'توت أزرق',
				grapes: 'عنب',
				pineapple: 'أناناس',
				vegetables: 'الخضروات',
				carrot: 'جزر',
				broccoli: 'بروكلي',
				spinach: 'سبانخ',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				selectFruit: 'בחר פרי',
				fruits: 'פירות',
				apple: 'תפוח',
				banana: 'בננה',
				blueberry: 'אוכמניה',
				grapes: 'ענבים',
				pineapple: 'אננס',
				vegetables: 'ירקות',
				carrot: 'גזר',
				broccoli: 'ברוקולי',
				spinach: 'תרד',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation()!.values);
	protected readonly _dir = computed(() => this._translation()!.dir);

	protected readonly _fruits = computed(() => this.fruits.map((value) => ({ value, label: this._t()[value] })));
	protected readonly _vegetables = computed(() => this.vegetables.map((value) => ({ value, label: this._t()[value] })));
	protected readonly _allItems = computed(() => [...this._fruits(), ...this._vegetables()]);
	public readonly itemToString = (value: string) =>
		this._allItems().find((item) => item.value === value)?.label ?? value;
}
