import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCreditCard, lucideSettings, lucideUser } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { MenuSide } from '@spartan-ng/brain/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-rtl',
	imports: [HlmDropdownMenuImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideUser, lucideCreditCard, lucideSettings }), Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[dir]': '_dir()',
	},
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu" align="start">
			{{ _t()['open'] }}
		</button>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-36">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem [hlmDropdownMenuSubTrigger]="accountMenu" side="right" align="start">
						{{ _t()['account'] }}
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>{{ _t()['team'] }}</hlm-dropdown-menu-label>
					<button hlmDropdownMenuItem>
						{{ _t()['team'] }}
					</button>
					<button hlmDropdownMenuItem [hlmDropdownMenuSubTrigger]="inviteMenu" side="right" align="start">
						{{ _t()['inviteUsers'] }}
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
					<button hlmDropdownMenuItem>
						{{ _t()['newTeam'] }}
						<hlm-dropdown-menu-shortcut>⌘+T</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>{{ _t()['view'] }}</hlm-dropdown-menu-label>
					<button hlmDropdownMenuCheckbox [checked]="statusBar()" (triggered)="statusBar.set(!statusBar())">
						{{ _t()['statusBar'] }}
						<hlm-dropdown-menu-checkbox-indicator />
					</button>

					<button hlmDropdownMenuCheckbox [checked]="activityBar()" (triggered)="activityBar.set(!activityBar())">
						{{ _t()['activityBar'] }}
						<hlm-dropdown-menu-checkbox-indicator />
					</button>

					<button hlmDropdownMenuCheckbox [checked]="panel()" (triggered)="panel.set(!panel())">
						{{ _t()['panel'] }}
						<hlm-dropdown-menu-checkbox-indicator />
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>{{ _t()['position'] }}</hlm-dropdown-menu-label>
					@let p = position();
					<button hlmDropdownMenuRadio [checked]="p === 'top'" (triggered)="position.set('top')">
						{{ _t()['top'] }}
						<hlm-dropdown-menu-radio-indicator />
					</button>
					<button hlmDropdownMenuRadio [checked]="p === 'bottom'" (triggered)="position.set('bottom')">
						{{ _t()['bottom'] }}
						<hlm-dropdown-menu-radio-indicator />
					</button>
					<button hlmDropdownMenuRadio [checked]="p === 'right'" (triggered)="position.set('right')">
						{{ _t()['right'] }}
						<hlm-dropdown-menu-radio-indicator />
					</button>
					<button hlmDropdownMenuRadio [checked]="p === 'left'" (triggered)="position.set('left')">
						{{ _t()['left'] }}
						<hlm-dropdown-menu-radio-indicator />
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem variant="destructive">
						{{ _t()['logout'] }}
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #accountMenu>
			<hlm-dropdown-menu-sub>
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideUser" />
					{{ _t()['profile'] }}
				</button>
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideCreditCard" />
					{{ _t()['billing'] }}
				</button>
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideSettings" />
					{{ _t()['settings'] }}
				</button>
			</hlm-dropdown-menu-sub>
		</ng-template>

		<ng-template #inviteMenu>
			<hlm-dropdown-menu-sub>
				<button hlmDropdownMenuItem>
					{{ _t()['email'] }}
				</button>
				<button hlmDropdownMenuItem>
					{{ _t()['message'] }}
				</button>
				<button hlmDropdownMenuItem [hlmDropdownMenuSubTrigger]="moreMenu" side="right" align="start">
					{{ _t()['more'] }}
					<hlm-dropdown-menu-item-sub-indicator />
				</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>
					{{ _t()['advanced'] }}
				</button>
			</hlm-dropdown-menu-sub>
		</ng-template>

		<ng-template #moreMenu>
			<hlm-dropdown-menu-sub>
				<button hlmDropdownMenuItem>
					{{ _t()['calendar'] }}
				</button>
				<button hlmDropdownMenuItem>
					{{ _t()['chat'] }}
				</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>
					{{ _t()['webhook'] }}
				</button>
			</hlm-dropdown-menu-sub>
		</ng-template>
	`,
})
export class DropdownRtl {
	public readonly statusBar = signal(true);
	public readonly activityBar = signal(false);
	public readonly panel = signal(false);
	public readonly position = signal<MenuSide>('bottom');

	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				open: 'Open',
				account: 'Account',
				profile: 'Profile',
				billing: 'Billing',
				settings: 'Settings',
				logout: 'Log out',
				team: 'Team',
				inviteUsers: 'Invite users',
				email: 'Email',
				message: 'Message',
				more: 'More',
				calendar: 'Calendar',
				chat: 'Chat',
				webhook: 'Webhook',
				advanced: 'Advanced...',
				newTeam: 'New Team',
				view: 'View',
				statusBar: 'Status Bar',
				activityBar: 'Activity Bar',
				panel: 'Panel',
				position: 'Position',
				top: 'Top',
				bottom: 'Bottom',
				right: 'Right',
				left: 'Left',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				open: 'افتح القائمة',
				account: 'الحساب',
				profile: 'الملف الشخصي',
				billing: 'الفوترة',
				settings: 'الإعدادات',
				logout: 'تسجيل الخروج',
				team: 'الفريق',
				inviteUsers: 'دعوة المستخدمين',
				email: 'البريد الإلكتروني',
				message: 'رسالة',
				more: 'المزيد',
				calendar: 'تقويم',
				chat: 'دردشة',
				webhook: 'خطاف ويب',
				advanced: 'متقدم...',
				newTeam: 'فريق جديد',
				view: 'عرض',
				statusBar: 'شريط الحالة',
				activityBar: 'شريط النشاط',
				panel: 'اللوحة',
				position: 'الموضع',
				top: 'أعلى',
				bottom: 'أسفل',
				right: 'يمين',
				left: 'يسار',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				open: 'פתח תפריט',
				account: 'חשבון',
				profile: 'פרופיל',
				billing: 'חיוב',
				settings: 'הגדרות',
				logout: 'התנתק',
				team: 'הצוות',
				inviteUsers: 'הזמן משתמשים',
				email: 'אימייל',
				message: 'הודעה',
				more: 'עוד',
				calendar: 'יומן',
				chat: "צ'אט",
				webhook: 'Webhook',
				advanced: 'מתקדם...',
				newTeam: 'צוות חדש',
				view: 'תצוגה',
				statusBar: 'שורת סטטוס',
				activityBar: 'שורת פעילות',
				panel: 'לוח',
				position: 'מיקום',
				top: 'למעלה',
				bottom: 'למטה',
				right: 'ימין',
				left: 'שמאל',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);

	private readonly _directionality = inject(Directionality);

	constructor() {
		effect(() => {
			const dir = this._dir();
			untracked(() => this._directionality.valueSignal.set(dir));
		});
	}
}
