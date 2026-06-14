import { Component, computed, inject, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';

@Component({
	selector: 'spartan-menubar-rtl',
	imports: [HlmMenubarImports, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideFolderCode, lucideArrowUpRight })],
	host: {
		'[dir]': '_dir()',
	},
	template: `
		<hlm-menubar>
			<button [hlmMenubarTrigger]="file">
				{{ _t()['file'] }}
			</button>

			<button [hlmMenubarTrigger]="edit">
				{{ _t()['edit'] }}
			</button>

			<button [hlmMenubarTrigger]="view">
				{{ _t()['view'] }}
			</button>

			<button [hlmMenubarTrigger]="profiles">
				{{ _t()['profiles'] }}
			</button>
		</hlm-menubar>

		<!-- FILE -->

		<ng-template #file>
			<hlm-dropdown-menu sideOffset="2">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						{{ _t()['newTab'] }}
						<hlm-dropdown-menu-shortcut>⌘T</hlm-dropdown-menu-shortcut>
					</button>

					<button hlmDropdownMenuItem>
						{{ _t()['newWindow'] }}
						<hlm-dropdown-menu-shortcut>⌘N</hlm-dropdown-menu-shortcut>
					</button>

					<button hlmDropdownMenuItem disabled>
						{{ _t()['newIncognitoWindow'] }}
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem [hlmDropdownMenuTrigger]="share" align="start" side="right">
						{{ _t()['share'] }}
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						{{ _t()['print'] }}
						<hlm-dropdown-menu-shortcut>⌘P</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<!-- SHARE SUBMENU -->

		<ng-template #share>
			<hlm-dropdown-menu-sub>
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						{{ _t()['emailLink'] }}
					</button>

					<button hlmDropdownMenuItem>
						{{ _t()['messages'] }}
					</button>

					<button hlmDropdownMenuItem>
						{{ _t()['notes'] }}
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu-sub>
		</ng-template>

		<!-- EDIT -->

		<ng-template #edit>
			<hlm-dropdown-menu sideOffset="2" class="w-56">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						{{ _t()['undo'] }}
						<hlm-dropdown-menu-shortcut>⌘Z</hlm-dropdown-menu-shortcut>
					</button>

					<button hlmDropdownMenuItem>
						{{ _t()['redo'] }}
						<hlm-dropdown-menu-shortcut>⇧⌘Z</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem [hlmDropdownMenuTrigger]="find" align="start" side="right">
						{{ _t()['find'] }}
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						{{ _t()['cut'] }}
					</button>

					<button hlmDropdownMenuItem>
						{{ _t()['copy'] }}
					</button>

					<button hlmDropdownMenuItem>
						{{ _t()['paste'] }}
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<!-- FIND SUBMENU -->

		<ng-template #find>
			<hlm-dropdown-menu-sub>
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						{{ _t()['searchTheWeb'] }}
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						{{ _t()['findItem'] }}
					</button>

					<button hlmDropdownMenuItem>
						{{ _t()['findNext'] }}
					</button>

					<button hlmDropdownMenuItem>
						{{ _t()['findPrevious'] }}
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu-sub>
		</ng-template>

		<!-- VIEW -->

		<ng-template #view>
			<hlm-dropdown-menu sideOffset="2" class="w-44">
				<button hlmDropdownMenuCheckbox>
					<hlm-dropdown-menu-checkbox-indicator />
					{{ _t()['bookmarksBar'] }}
				</button>

				<button hlmDropdownMenuCheckbox checked>
					<hlm-dropdown-menu-checkbox-indicator />
					{{ _t()['fullUrls'] }}
				</button>

				<hlm-dropdown-menu-separator />

				<button hlmDropdownMenuItem inset>
					{{ _t()['reload'] }}
					<hlm-dropdown-menu-shortcut>⌘R</hlm-dropdown-menu-shortcut>
				</button>

				<button hlmDropdownMenuItem inset disabled>
					{{ _t()['forceReload'] }}
					<hlm-dropdown-menu-shortcut>⇧⌘R</hlm-dropdown-menu-shortcut>
				</button>

				<hlm-dropdown-menu-separator />

				<button hlmDropdownMenuItem inset>
					{{ _t()['toggleFullscreen'] }}
				</button>

				<hlm-dropdown-menu-separator />

				<button hlmDropdownMenuItem inset>
					{{ _t()['hideSidebar'] }}
				</button>
			</hlm-dropdown-menu>
		</ng-template>

		<!-- PROFILES -->

		<ng-template #profiles>
			<hlm-dropdown-menu sideOffset="2" class="w-48">
				<button hlmDropdownMenuRadio [checked]="_profile() === 'andy'" (click)="_profile.set('andy')">
					<hlm-dropdown-menu-radio-indicator />
					{{ _t()['andy'] }}
				</button>

				<button hlmDropdownMenuRadio [checked]="_profile() === 'benoit'" (click)="_profile.set('benoit')">
					<hlm-dropdown-menu-radio-indicator />
					{{ _t()['benoit'] }}
				</button>

				<button hlmDropdownMenuRadio [checked]="_profile() === 'luis'" (click)="_profile.set('luis')">
					<hlm-dropdown-menu-radio-indicator />
					{{ _t()['luis'] }}
				</button>

				<hlm-dropdown-menu-separator />

				<button hlmDropdownMenuItem inset>
					{{ _t()['editProfile'] }}
				</button>

				<hlm-dropdown-menu-separator />

				<button hlmDropdownMenuItem inset>
					{{ _t()['addProfile'] }}
				</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class MenubarRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				file: 'File',
				newTab: 'New Tab',
				newWindow: 'New Window',
				newIncognitoWindow: 'New Incognito Window',
				share: 'Share',
				emailLink: 'Email link',
				messages: 'Messages',
				notes: 'Notes',
				print: 'Print...',
				edit: 'Edit',
				undo: 'Undo',
				redo: 'Redo',
				find: 'Find',
				searchTheWeb: 'Search the web',
				findItem: 'Find...',
				findNext: 'Find Next',
				findPrevious: 'Find Previous',
				cut: 'Cut',
				copy: 'Copy',
				paste: 'Paste',
				view: 'View',
				bookmarksBar: 'Bookmarks Bar',
				fullUrls: 'Full URLs',
				reload: 'Reload',
				forceReload: 'Force Reload',
				toggleFullscreen: 'Toggle Fullscreen',
				hideSidebar: 'Hide Sidebar',
				profiles: 'Profiles',
				andy: 'Andy',
				benoit: 'Benoit',
				luis: 'Luis',
				editProfile: 'Edit...',
				addProfile: 'Add Profile...',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				file: 'ملف',
				newTab: 'علامة تبويب جديدة',
				newWindow: 'نافذة جديدة',
				newIncognitoWindow: 'نافذة التصفح المتخفي الجديدة',
				share: 'مشاركة',
				emailLink: 'رابط البريد الإلكتروني',
				messages: 'الرسائل',
				notes: 'الملاحظات',
				print: 'طباعة...',
				edit: 'تعديل',
				undo: 'تراجع',
				redo: 'إعادة',
				find: 'بحث',
				searchTheWeb: 'البحث على الويب',
				findItem: 'بحث...',
				findNext: 'البحث التالي',
				findPrevious: 'البحث السابق',
				cut: 'قص',
				copy: 'نسخ',
				paste: 'لصق',
				view: 'عرض',
				bookmarksBar: 'شريط الإشارات المرجعية',
				fullUrls: 'عناوين URL الكاملة',
				reload: 'إعادة تحميل',
				forceReload: 'إعادة تحميل قسري',
				toggleFullscreen: 'تبديل وضع ملء الشاشة',
				hideSidebar: 'إخفاء الشريط الجانبي',
				profiles: 'الملفات الشخصية',
				andy: 'Andy',
				benoit: 'Benoit',
				luis: 'Luis',
				editProfile: 'تعديل...',
				addProfile: 'إضافة ملف شخصي...',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				file: 'קובץ',
				newTab: 'כרטיסייה חדשה',
				newWindow: 'חלון חדש',
				newIncognitoWindow: 'חלון גלישה בסתר חדש',
				share: 'שתף',
				emailLink: 'קישור אימייל',
				messages: 'הודעות',
				notes: 'הערות',
				print: 'הדפס...',
				edit: 'ערוך',
				undo: 'בטל',
				redo: 'בצע שוב',
				find: 'מצא',
				searchTheWeb: 'חפש באינטרנט',
				findItem: 'מצא...',
				findNext: 'מצא הבא',
				findPrevious: 'מצא הקודם',
				cut: 'גזור',
				copy: 'העתק',
				paste: 'הדבק',
				view: 'תצוגה',
				bookmarksBar: 'סרגל סימניות',
				fullUrls: 'כתובות URL מלאות',
				reload: 'רענן',
				forceReload: 'רענן בכוח',
				toggleFullscreen: 'החלף מסך מלא',
				hideSidebar: 'הסתר סרגל צד',
				profiles: 'פרופילים',
				andy: 'Andy',
				benoit: 'Benoit',
				luis: 'Luis',
				editProfile: 'ערוך...',
				addProfile: 'הוסף פרופיל...',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
	protected readonly _profile = signal('');
}
