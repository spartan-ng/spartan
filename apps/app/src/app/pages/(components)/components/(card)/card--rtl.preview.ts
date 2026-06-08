import { Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-card-rtl',
	imports: [HlmCardImports, HlmLabelImports, HlmInputImports, HlmButtonImports],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full max-w-sm" [dir]="_dir()">
			<hlm-card-header>
				<h3 hlmCardTitle>{{ _t()['title'] }}</h3>
				<p hlmCardDescription>{{ _t()['description'] }}</p>

				<div hlmCardAction>
					<button hlmBtn variant="link">{{ _t()['signUp'] }}</button>
				</div>
			</hlm-card-header>

			<div hlmCardContent>
				<form id="login-form-rtl">
					<div class="flex flex-col gap-6">
						<div class="grid gap-2">
							<label hlmLabel for="email">{{ _t()['email'] }}</label>
							<input type="email" id="email" placeholder="{{ _t()['emailPlaceholder'] }}" required hlmInput />
						</div>

						<div class="grid gap-2">
							<div class="flex items-center">
								<label hlmLabel for="password">{{ _t()['password'] }}</label>
								<a href="#" class="ms-auto inline-block text-sm underline-offset-4 hover:underline">
									{{ _t()['forgotPassword'] }}
								</a>
							</div>
							<input type="password" id="password" hlmInput />
						</div>
					</div>
				</form>
			</div>

			<hlm-card-footer class="flex-col gap-2">
				<button hlmBtn type="submit" class="w-full" form="login-form-rtl">{{ _t()['login'] }}</button>
				<button hlmBtn variant="outline" class="w-full">{{ _t()['loginWithGoogle'] }}</button>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class CardRtl {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				title: 'Login to your account',
				description: 'Enter your email below to login to your account',
				signUp: 'Sign Up',
				email: 'Email',
				emailPlaceholder: 'm@example.com',
				password: 'Password',
				forgotPassword: 'Forgot your password?',
				login: 'Login',
				loginWithGoogle: 'Login with Google',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				title: 'تسجيل الدخول إلى حسابك',
				description: 'أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك',
				signUp: 'إنشاء حساب',
				email: 'البريد الإلكتروني',
				emailPlaceholder: 'm@example.com',
				password: 'كلمة المرور',
				forgotPassword: 'نسيت كلمة المرور؟',
				login: 'تسجيل الدخول',
				loginWithGoogle: 'تسجيل الدخول باستخدام Google',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				title: 'התחבר לחשבון שלך',
				description: 'הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך',
				signUp: 'הירשם',
				email: 'אימייל',
				emailPlaceholder: 'm@example.com',
				password: 'סיסמה',
				forgotPassword: 'שכחת את הסיסמה?',
				login: 'התחבר',
				loginWithGoogle: 'התחבר עם Google',
			},
		},
	};
	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation()!.values);
	protected readonly _dir = computed(() => this._translation()!.dir);
}
