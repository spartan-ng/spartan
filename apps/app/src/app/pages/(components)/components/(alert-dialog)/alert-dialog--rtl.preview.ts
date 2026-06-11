import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBluetooth } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-alert-dialog-rtl',
	imports: [HlmAlertDialogImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideBluetooth })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex gap-4" [dir]="_dir()">
			<hlm-alert-dialog>
				<button hlmAlertDialogTrigger hlmBtn variant="outline">{{ _t()['showDialog'] }}</button>
				<hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx" [dir]="_dir()">
					<hlm-alert-dialog-header>
						<h2 hlmAlertDialogTitle>{{ _t()['title'] }}</h2>
						<p hlmAlertDialogDescription>
							{{ _t()['description'] }}
						</p>
					</hlm-alert-dialog-header>
					<hlm-alert-dialog-footer>
						<button hlmAlertDialogCancel>{{ _t()['cancel'] }}</button>
						<button hlmAlertDialogAction>{{ _t()['continue'] }}</button>
					</hlm-alert-dialog-footer>
				</hlm-alert-dialog-content>
			</hlm-alert-dialog>
			<hlm-alert-dialog>
				<button hlmAlertDialogTrigger hlmBtn variant="outline">{{ _t()['showDialogSm'] }}</button>
				<hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx" size="sm" [dir]="_dir()">
					<hlm-alert-dialog-header>
						<hlm-alert-dialog-media>
							<ng-icon name="lucideBluetooth" />
						</hlm-alert-dialog-media>
						<h2 hlmAlertDialogTitle>{{ _t()['smallTitle'] }}</h2>
						<p hlmAlertDialogDescription>
							{{ _t()['smallDescription'] }}
						</p>
					</hlm-alert-dialog-header>
					<hlm-alert-dialog-footer>
						<button hlmAlertDialogCancel>{{ _t()['dontAllow'] }}</button>
						<button hlmAlertDialogAction>{{ _t()['allow'] }}</button>
					</hlm-alert-dialog-footer>
				</hlm-alert-dialog-content>
			</hlm-alert-dialog>
		</div>
	`,
})
export class AlertDialogRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				showDialog: 'Show Dialog',
				showDialogSm: 'Show Dialog (sm)',
				title: 'Are you absolutely sure?',
				description: 'This action cannot be undone. This will permanently delete your account from our servers.',
				cancel: 'Cancel',
				continue: 'Continue',
				smallTitle: 'Allow accessory to connect?',
				smallDescription: 'Do you want to allow the USB accessory to connect to this device?',
				dontAllow: "Don't allow",
				allow: 'Allow',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				showDialog: 'إظهار الحوار',
				showDialogSm: 'إظهار الحوار (صغير)',
				title: 'هل أنت متأكد تمامًا؟',
				description: 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا من خوادمنا.',
				cancel: 'إلغاء',
				continue: 'متابعة',
				smallTitle: 'السماح للملحق بالاتصال؟',
				smallDescription: 'هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟',
				dontAllow: 'عدم السماح',
				allow: 'السماح',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				showDialog: 'הצג דיאלוג',
				showDialogSm: 'הצג דיאלוג (קטן)',
				title: 'האם אתה בטוח לחלוטין?',
				description: 'פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את החשבון שלך מהשרתים שלנו.',
				cancel: 'ביטול',
				continue: 'המשך',
				smallTitle: 'לאפשר להתקן להתחבר?',
				smallDescription: 'האם אתה רוצה לאפשר להתקן USB להתחבר למכשיר זה?',
				dontAllow: 'אל תאפשר',
				allow: 'אפשר',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
