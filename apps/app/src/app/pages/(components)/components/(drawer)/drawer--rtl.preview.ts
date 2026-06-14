import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-drawer-rtl',
	imports: [HlmDrawerImports, HlmFieldImports, HlmButtonImports, HlmInputImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer [dir]="_dir()">
			<button hlmDrawerTrigger hlmBtn variant="outline">{{ _t()['open'] }}</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx" [dir]="_dir()">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>{{ _t()['editProfile'] }}</h3>
					<p hlmDrawerDescription>{{ _t()['description'] }}</p>
				</hlm-drawer-header>
				<hlm-field-group class="px-4">
					<hlm-field>
						<label hlmFieldLabel for="name-rtl">{{ _t()['name'] }}</label>
						<input hlmInput id="name-rtl" value="Pedro Duarte" />
					</hlm-field>
					<hlm-field>
						<label hlmFieldLabel for="username-rtl">{{ _t()['username'] }}</label>
						<input hlmInput id="username-rtl" value="peduarte" />
					</hlm-field>
				</hlm-field-group>
				<hlm-drawer-footer>
					<button hlmBtn type="submit">{{ _t()['save'] }}</button>
					<button hlmDrawerClose hlmBtn variant="outline">{{ _t()['close'] }}</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				open: 'Open',
				editProfile: 'Edit profile',
				description: "Make changes to your profile here. Click save when you're done.",
				name: 'Name',
				username: 'Username',
				save: 'Save changes',
				close: 'Close',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				open: 'فتح',
				editProfile: 'تعديل الملف الشخصي',
				description: 'قم بإجراء تغييرات على ملفك الشخصي هنا. انقر حفظ عند الانتهاء.',
				name: 'الاسم',
				username: 'اسم المستخدم',
				save: 'حفظ التغييرات',
				close: 'إغلاق',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				open: 'פתח',
				editProfile: 'עריכת פרופיל',
				description: 'בצע שינויים בפרופיל שלך כאן. לחץ שמור כשתסיים.',
				name: 'שם',
				username: 'שם משתמש',
				save: 'שמור שינויים',
				close: 'סגור',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
