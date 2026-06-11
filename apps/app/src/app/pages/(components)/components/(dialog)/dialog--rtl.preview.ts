import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-dialog-rtl',
	imports: [HlmDialogImports, HlmFieldImports, HlmInputImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog [dir]="_dir()">
			<button hlmDialogTrigger hlmBtn variant="outline">{{ _t()['openDialog'] }}</button>
			<hlm-dialog-content *hlmDialogPortal="let ctx" class="sm:max-w-sm" [dir]="_dir()">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>{{ _t()['editProfile'] }}</h3>
					<p hlmDialogDescription>{{ _t()['description'] }}</p>
				</hlm-dialog-header>
				<hlm-field-group>
					<hlm-field>
						<label hlmFieldLabel for="name">{{ _t()['name'] }}</label>
						<input hlmInput id="name" value="Pedro Duarte" />
					</hlm-field>
					<hlm-field>
						<label hlmFieldLabel for="username">{{ _t()['username'] }}</label>
						<input hlmInput id="username" value="@peduarte" />
					</hlm-field>
				</hlm-field-group>
				<hlm-dialog-footer>
					<button hlmBtn variant="outline" hlmDialogClose>{{ _t()['cancel'] }}</button>
					<button hlmBtn type="submit">{{ _t()['saveChanges'] }}</button>
				</hlm-dialog-footer>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class DialogRtl {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				openDialog: 'Open Dialog',
				editProfile: 'Edit profile',
				description: "Make changes to your profile here. Click save when you're done.",
				name: 'Name',
				username: 'Username',
				cancel: 'Cancel',
				saveChanges: 'Save changes',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				openDialog: 'فتح الحوار',
				editProfile: 'تعديل الملف الشخصي',
				description: 'قم بإجراء تغييرات على ملفك الشخصي هنا. انقر فوق حفظ عند الانتهاء.',
				name: 'الاسم',
				username: 'اسم المستخدم',
				cancel: 'إلغاء',
				saveChanges: 'حفظ التغييرات',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				openDialog: 'פתח דיאלוג',
				editProfile: 'ערוך פרופיל',
				description: 'בצע שינויים בפרופיל שלך כאן. לחץ על שמור כשתסיים.',
				name: 'שם',
				username: 'שם משתמש',
				cancel: 'בטל',
				saveChanges: 'שמור שינויים',
			},
		},
	};
	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
