import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight, lucideRotateCcw } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-context-menu-rtl',
	imports: [HlmDropdownMenuImports, HlmContextMenuImports, NgIcon],
	providers: [provideIcons({ lucideArrowLeft, lucideArrowRight, lucideRotateCcw }), Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[dir]': '_dir()',
	},
	template: `
		<div
			[hlmContextMenuTrigger]="menu"
			align="start"
			side="right"
			class="flex aspect-video w-full min-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
		>
			<span class="hidden pointer-fine:inline-block">{{ _t()['rightClick'] }}</span>
			<span class="hidden pointer-coarse:inline-block">{{ _t()['longPress'] }}</span>
		</div>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-48">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem [hlmDropdownMenuSubTrigger]="navigationMenu" side="right" align="start">
						{{ _t()['navigation'] }}
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
					<button hlmDropdownMenuItem [hlmDropdownMenuSubTrigger]="moreToolsMenu" side="right" align="start">
						{{ _t()['moreTools'] }}
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuCheckbox checked>
						{{ _t()['showBookmarks'] }}
						<hlm-dropdown-menu-checkbox-indicator />
					</button>
					<button hlmDropdownMenuCheckbox>
						{{ _t()['showFullUrls'] }}
						<hlm-dropdown-menu-checkbox-indicator />
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>{{ _t()['people'] }}</hlm-dropdown-menu-label>
					<button hlmDropdownMenuRadio checked>
						{{ _t()['pedro'] }}
						<hlm-dropdown-menu-radio-indicator />
					</button>
					<button hlmDropdownMenuRadio>
						{{ _t()['colm'] }}
						<hlm-dropdown-menu-radio-indicator />
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #navigationMenu>
			<hlm-dropdown-menu-sub class="w-44">
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideArrowLeft" />
					{{ _t()['back'] }}
					<hlm-dropdown-menu-shortcut>⌘[</hlm-dropdown-menu-shortcut>
				</button>
				<button hlmDropdownMenuItem disabled>
					<ng-icon name="lucideArrowRight" />
					{{ _t()['forward'] }}
					<hlm-dropdown-menu-shortcut>⌘]</hlm-dropdown-menu-shortcut>
				</button>
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideRotateCcw" />
					{{ _t()['reload'] }}
					<hlm-dropdown-menu-shortcut>⌘R</hlm-dropdown-menu-shortcut>
				</button>
			</hlm-dropdown-menu-sub>
		</ng-template>
		<ng-template #moreToolsMenu>
			<hlm-dropdown-menu-sub class="w-44">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						{{ _t()['savePage'] }}
					</button>
					<button hlmDropdownMenuItem>
						{{ _t()['createShortcut'] }}
					</button>
					<button hlmDropdownMenuItem>
						{{ _t()['nameWindow'] }}
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						{{ _t()['developerTools'] }}
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem variant="destructive">
						{{ _t()['delete'] }}
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu-sub>
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

	private readonly _directionality = inject(Directionality);

	constructor() {
		effect(() => {
			const dir = this._dir();
			untracked(() => this._directionality.valueSignal.set(dir));
		});
	}
}
