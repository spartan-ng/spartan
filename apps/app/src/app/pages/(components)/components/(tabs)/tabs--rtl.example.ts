import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'spartan-tabs-rtl-preview',
	imports: [HlmTabsImports, HlmCardImports, HlmLabelImports, HlmInputImports, HlmButtonImports],
	providers: [Directionality],
	host: {
		class: 'block w-full max-w-lg',
		'[dir]': '_dir()',
	},
	template: `
		<hlm-tabs tab="account" class="w-full">
			<hlm-tabs-list [attr.aria-label]="_t()['tabsLabel']">
				<button hlmTabsTrigger="account">{{ _t()['accountTab'] }}</button>
				<button hlmTabsTrigger="password">{{ _t()['passwordTab'] }}</button>
			</hlm-tabs-list>
			<div hlmTabsContent="account">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>{{ _t()['accountTab'] }}</h3>
						<p hlmCardDescription>{{ _t()['accountDescription'] }}</p>
					</div>
					<p hlmCardContent>
						<label class="my-4 block" hlmLabel>
							{{ _t()['nameLabel'] }}
							<input class="mt-1.5 w-full" value="Pedro Duarte" hlmInput />
						</label>
						<label class="my-4 block" hlmLabel>
							{{ _t()['usernameLabel'] }}
							<input class="mt-1.5 w-full" placeholder="@peduarte" hlmInput />
						</label>
					</p>
					<div hlmCardFooter>
						<button hlmBtn>{{ _t()['saveChanges'] }}</button>
					</div>
				</section>
			</div>
			<div hlmTabsContent="password">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>{{ _t()['passwordTab'] }}</h3>
						<p hlmCardDescription>{{ _t()['passwordDescription'] }}</p>
					</div>
					<p hlmCardContent>
						<label class="my-4 block" hlmLabel>
							{{ _t()['oldPasswordLabel'] }}
							<input class="mt-1.5 w-full" type="password" hlmInput />
						</label>
						<label class="my-4 block" hlmLabel>
							{{ _t()['newPasswordLabel'] }}
							<input class="mt-1.5 w-full" type="password" hlmInput />
						</label>
					</p>
					<div hlmCardFooter>
						<button hlmBtn>{{ _t()['savePassword'] }}</button>
					</div>
				</section>
			</div>
		</hlm-tabs>
	`,
})
export class TabsRtlPreview {
	private readonly _directionality = inject(Directionality);
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				tabsLabel: 'Account settings',
				accountTab: 'Account',
				passwordTab: 'Password',
				accountDescription: "Make changes to your account here. Click save when you're done.",
				passwordDescription: "Change your password here. After saving, you'll be logged out.",
				nameLabel: 'Name',
				usernameLabel: 'Username',
				oldPasswordLabel: 'Old Password',
				newPasswordLabel: 'New Password',
				saveChanges: 'Save Changes',
				savePassword: 'Save Password',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				tabsLabel: 'إعدادات الحساب',
				accountTab: 'الحساب',
				passwordTab: 'كلمة المرور',
				accountDescription: 'قم بإجراء تغييرات على حسابك هنا. انقر على حفظ عند الانتهاء.',
				passwordDescription: 'غيّر كلمة المرور هنا. بعد الحفظ، سيتم تسجيل خروجك.',
				nameLabel: 'الاسم',
				usernameLabel: 'اسم المستخدم',
				oldPasswordLabel: 'كلمة المرور القديمة',
				newPasswordLabel: 'كلمة المرور الجديدة',
				saveChanges: 'حفظ التغييرات',
				savePassword: 'حفظ كلمة المرور',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				tabsLabel: 'הגדרות חשבון',
				accountTab: 'חשבון',
				passwordTab: 'סיסמה',
				accountDescription: 'בצע שינויים בחשבון שלך כאן. לחץ על שמירה בסיום.',
				passwordDescription: 'שנה את הסיסמה שלך כאן. לאחר השמירה, תנותק מהמערכת.',
				nameLabel: 'שם',
				usernameLabel: 'שם משתמש',
				oldPasswordLabel: 'סיסמה ישנה',
				newPasswordLabel: 'סיסמה חדשה',
				saveChanges: 'שמור שינויים',
				savePassword: 'שמור סיסמה',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);

	constructor() {
		effect(() => {
			const dir = this._dir();
			untracked(() => this._directionality.valueSignal.set(dir));
		});
	}
}
