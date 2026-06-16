import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-context-menu-rtl',
	imports: [HlmDropdownMenuImports, HlmContextMenuImports],
	providers: [provideIcons({ lucideFolderCode, lucideArrowUpRight }), Directionality],
	host: {
		'[dir]': '_dir()',
	},
	template: `
		<div
			[hlmContextMenuTrigger]="menu"
			align="start"
			side="right"
			class="flex aspect-video h-[150px] w-[300px] items-center justify-center rounded-xl border border-dashed text-sm"
		>
			<span class="hidden pointer-fine:inline-block">{{ _t()['rightClick'] }}</span>
			<span class="hidden pointer-coarse:inline-block">
				{{ _t()['longPress'] }}
			</span>
		</div>

		<ng-template #menu>
			<hlm-dropdown-menu sideOffset="2">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem [hlmDropdownMenuTrigger]="navigation" align="start" side="right">
						{{ _t()['navigation'] }}
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
					<button hlmDropdownMenuItem [hlmDropdownMenuTrigger]="moreTools" align="start" side="right">
						{{ _t()['moreTools'] }}
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuCheckbox checked>
						<hlm-dropdown-menu-checkbox-indicator />
						{{ _t()['showBookmarks'] }}
					</button>

					<button hlmDropdownMenuCheckbox>
						<hlm-dropdown-menu-checkbox-indicator />
						{{ _t()['showFullUrls'] }}
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>
						{{ _t()['people'] }}
					</hlm-dropdown-menu-label>

					<button hlmDropdownMenuRadio value="pedro" checked>
						<hlm-dropdown-menu-radio-indicator />
						{{ _t()['pedro'] }}
					</button>
					<button hlmDropdownMenuRadio value="colm">
						<hlm-dropdown-menu-radio-indicator />
						{{ _t()['colm'] }}
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #navigation>
			<hlm-dropdown-menu-sub>
				<button hlmDropdownMenuItem>
					{{ _t()['back'] }}
					<hlm-dropdown-menu-shortcut>⌘[</hlm-dropdown-menu-shortcut>
				</button>

				<button hlmDropdownMenuItem disabled>
					{{ _t()['forward'] }}
					<hlm-dropdown-menu-shortcut>⌘]</hlm-dropdown-menu-shortcut>
				</button>

				<button hlmDropdownMenuItem>
					{{ _t()['reload'] }}
					<hlm-dropdown-menu-shortcut>⌘R</hlm-dropdown-menu-shortcut>
				</button>
			</hlm-dropdown-menu-sub>
		</ng-template>

		<ng-template #moreTools>
			<hlm-dropdown-menu sideOffset="2" class="w-56">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>{{ _t()['savePage'] }}</button>
					<button hlmDropdownMenuItem>{{ _t()['createShortcut'] }}</button>
					<button hlmDropdownMenuItem>{{ _t()['nameWindow'] }}</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>{{ _t()['developerTools'] }}</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem variant="destructive">
						{{ _t()['delete'] }}
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class ContextMenuRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				rightClick: 'Right click here',
				longPress: 'Long press here',
				navigation: 'Navigation',
				back: 'Back',
				forward: 'Forward',
				reload: 'Reload',
				moreTools: 'More Tools',
				savePage: 'Save Page...',
				createShortcut: 'Create Shortcut...',
				nameWindow: 'Name Window...',
				developerTools: 'Developer Tools',
				delete: 'Delete',
				showBookmarks: 'Show Bookmarks',
				showFullUrls: 'Show Full URLs',
				people: 'People',
				pedro: 'Pedro Duarte',
				colm: 'Colm Tuite',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				rightClick: 'انقر بزر الماوس الأيمن هنا',
				longPress: 'اضغط مطولاً هنا',
				navigation: 'التنقل',
				back: 'رجوع',
				forward: 'تقدم',
				reload: 'إعادة تحميل',
				moreTools: 'المزيد من الأدوات',
				savePage: 'حفظ الصفحة...',
				createShortcut: 'إنشاء اختصار...',
				nameWindow: 'تسمية النافذة...',
				developerTools: 'أدوات المطور',
				delete: 'حذف',
				showBookmarks: 'إظهار الإشارات المرجعية',
				showFullUrls: 'إظهار عناوين URL الكاملة',
				people: 'الأشخاص',
				pedro: 'Pedro Duarte',
				colm: 'Colm Tuite',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				rightClick: 'לחץ לחיצה ימנית כאן',
				longPress: 'לחץ לחיצה ארוכה כאן',
				navigation: 'ניווט',
				back: 'חזור',
				forward: 'קדימה',
				reload: 'רענן',
				moreTools: 'כלים נוספים',
				savePage: 'שמור עמוד...',
				createShortcut: 'צור קיצור דרך...',
				nameWindow: 'שם חלון...',
				developerTools: 'כלי מפתח',
				delete: 'מחק',
				showBookmarks: 'הצג סימניות',
				showFullUrls: 'הצג כתובות URL מלאות',
				people: 'אנשים',
				pedro: 'Pedro Duarte',
				colm: 'Colm Tuite',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
	protected readonly _profile = signal('');

	private readonly _directionality = inject(Directionality);

	constructor() {
		effect(() => {
			const dir = this._dir();
			untracked(() => this._directionality.valueSignal.set(dir));
		});
	}
}
