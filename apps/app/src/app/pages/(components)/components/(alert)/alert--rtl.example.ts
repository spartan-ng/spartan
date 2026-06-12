import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheckCircle2, lucideInfo } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

@Component({
	selector: 'spartan-alert-rtl-preview',
	imports: [NgIcon, HlmAlertImports],
	providers: [
		provideIcons({
			lucideCheckCircle2,
			lucideInfo,
		}),
	],
	host: {
		class: 'grid w-full max-w-md items-start gap-4',
		'[dir]': '_dir()',
	},
	template: `
		@for (alert of _alerts; track alert) {
			<hlm-alert>
				<ng-icon [name]="alert.icon" />
				<h4 hlmAlertTitle>{{ _t()[alert.titleKey] }}</h4>
				<p hlmAlertDescription>
					{{ _t()[alert.descriptionKey] }}
				</p>
			</hlm-alert>
		}
	`,
})
export class AlertRtlPreview {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				paymentTitle: 'Payment successful',
				paymentDescription: 'Your payment of $29.99 has been processed. A receipt has been sent to your email address.',
				featureTitle: 'New feature available',
				featureDescription: "We've added dark mode support. You can enable it in your account settings.",
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				paymentTitle: 'تم الدفع بنجاح',
				paymentDescription: 'تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك الإلكتروني.',
				featureTitle: 'ميزة جديدة متاحة',
				featureDescription: 'لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك.',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				paymentTitle: 'התשלום בוצע בהצלחה',
				paymentDescription: 'התשלום שלך בסך 29.99 דולר עובד. קבלה נשלחה לכתובת האימייל שלך.',
				featureTitle: 'תכונה חדשה זמינה',
				featureDescription: 'הוספנו תמיכה במצב כהה. אתה יכול להפעיל אותו בהגדרות החשבון שלך.',
			},
		},
	};

	protected readonly _alerts = [
		{
			icon: 'lucideCheckCircle2',
			titleKey: 'paymentTitle' as const,
			descriptionKey: 'paymentDescription' as const,
		},
		{
			icon: 'lucideInfo',
			titleKey: 'featureTitle' as const,
			descriptionKey: 'featureDescription' as const,
		},
	];

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
