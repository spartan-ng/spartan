import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';

@Component({
	selector: 'spartan-native-select-rtl',
	imports: [HlmNativeSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-native-select [attr.dir]="_dir()">
			<option hlmNativeSelectOption value="">{{ _t()['placeholder'] }}</option>
			<option hlmNativeSelectOption value="todo">{{ _t()['todo'] }}</option>
			<option hlmNativeSelectOption value="in-progress">{{ _t()['inProgress'] }}</option>
			<option hlmNativeSelectOption value="done">{{ _t()['done'] }}</option>
			<option hlmNativeSelectOption value="cancelled">{{ _t()['cancelled'] }}</option>
		</hlm-native-select>
	`,
})
export class NativeSelectRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				placeholder: 'Select status',
				todo: 'Todo',
				inProgress: 'In Progress',
				done: 'Done',
				cancelled: 'Cancelled',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				placeholder: 'اختر الحالة',
				todo: 'مهام',
				inProgress: 'قيد التنفيذ',
				done: 'منجز',
				cancelled: 'ملغي',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				placeholder: 'בחר סטטוס',
				todo: 'לעשות',
				inProgress: 'בתהליך',
				done: 'הושלם',
				cancelled: 'בוטל',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
