import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideBadgeCheck,
	lucideBell,
	lucideBookOpen,
	lucideBot,
	lucideChartPie,
	lucideChevronRight,
	lucideChevronsUpDown,
	lucideCreditCard,
	lucideEllipsis,
	lucideFolder,
	lucideFrame,
	lucideGalleryVerticalEnd,
	lucideLifeBuoy,
	lucideLogOut,
	lucideMap,
	lucideSend,
	lucideSettings2,
	lucideShare,
	lucideSparkles,
	lucideSquareTerminal,
	lucideTrash2,
} from '@ng-icons/lucide';
import { TranslateService, Translations, type Language } from '@spartan-ng/app/app/shared/translate.service';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-sidebar-rtl',
	imports: [
		HlmSidebarImports,
		NgIcon,
		HlmCollapsibleImports,
		RouterLink,
		HlmAvatarImports,
		HlmDropdownMenuImports,
		HlmSelectImports,
	],
	providers: [
		provideIcons({
			lucideFrame,
			lucideChartPie,
			lucideMap,
			lucideLifeBuoy,
			lucideSend,
			lucideGalleryVerticalEnd,
			lucideChevronsUpDown,
			lucideSquareTerminal,
			lucideBot,
			lucideBookOpen,
			lucideSettings2,
			lucideChevronRight,
			lucideSparkles,
			lucideBadgeCheck,
			lucideCreditCard,
			lucideBell,
			lucideLogOut,
			lucideEllipsis,
			lucideFolder,
			lucideShare,
			lucideTrash2,
		}),
	],
	encapsulation: ViewEncapsulation.None,
	styleUrl: 'sidebar-default.css',
	template: `
		<div hlmSidebarWrapper [attr.dir]="_dir()">
			<hlm-sidebar collapsible="icon" [side]="_sidebarSide()">
				<hlm-sidebar-header>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<button hlmSidebarMenuButton size="lg">
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<ng-icon name="lucideGalleryVerticalEnd" />
								</div>
								<div class="grid flex-1 text-start text-sm leading-tight">
									<span class="truncate font-medium">{{ _t()['teamName'] }}</span>
									<span class="truncate text-xs">{{ _t()['teamPlan'] }}</span>
								</div>
							</button>
						</li>
					</ul>
				</hlm-sidebar-header>
				<hlm-sidebar-content>
					<hlm-sidebar-group>
						<div hlmSidebarGroupLabel>{{ _t()['platform'] }}</div>
						<ul hlmSidebarMenu>
							@for (item of _platforms; track $index) {
								<hlm-collapsible [expanded]="item.isActive ?? false" class="group/collapsible">
									<li hlmSidebarMenuItem>
										<button hlmSidebarMenuButton hlmCollapsibleTrigger>
											<ng-icon [name]="item.icon" />
											{{ _t()[item.titleKey] }}
											<ng-icon
												name="lucideChevronRight"
												class="ms-auto transition-transform duration-200 group-data-open/collapsible:rotate-90 rtl:rotate-180 rtl:group-data-open/collapsible:rotate-90"
											/>
										</button>
										<hlm-collapsible-content>
											<ul hlmSidebarMenuSub>
												@for (subItem of item.items; track $index) {
													<li hlmSidebarMenuSubItem>
														<a hlmSidebarMenuSubButton [routerLink]="subItem.url">{{ _t()[subItem.titleKey] }}</a>
													</li>
												}
											</ul>
										</hlm-collapsible-content>
									</li>
								</hlm-collapsible>
							}
						</ul>
					</hlm-sidebar-group>
					<hlm-sidebar-group class="group-data-[collapsible=icon]:hidden">
						<div hlmSidebarGroupLabel>{{ _t()['projects'] }}</div>
						<ul hlmSidebarMenu>
							@for (project of _projects; track $index) {
								<li hlmSidebarMenuItem>
									<a hlmSidebarMenuButton [routerLink]="project.url">
										<ng-icon [name]="project.icon" />
										{{ _t()[project.nameKey] }}
									</a>
									<button
										hlmSidebarMenuAction
										showOnHover
										[hlmDropdownMenuTrigger]="projectMenu"
										[hlmDropdownMenuTriggerData]="{ $implicit: { project } }"
										[side]="_menuSide()"
										[align]="_menuAlign()"
									>
										<ng-icon name="lucideEllipsis" />
										<span class="sr-only">{{ _t()['more'] }}</span>
									</button>
								</li>
							}
							<li hlmSidebarMenuItem>
								<button hlmSidebarMenuButton>
									<ng-icon name="lucideEllipsis" />
									{{ _t()['more'] }}
								</button>
							</li>
						</ul>
					</hlm-sidebar-group>

					<ng-template #projectMenu let-ctx>
						<hlm-dropdown-menu class="w-48">
							<hlm-dropdown-menu-group>
								<hlm-dropdown-menu-label>{{ _t()[ctx.project.nameKey] }}</hlm-dropdown-menu-label>
							</hlm-dropdown-menu-group>
							<hlm-dropdown-menu-separator />
							<button hlmDropdownMenuItem>
								<ng-icon name="lucideFolder" />
								{{ _t()['viewProject'] }}
							</button>
							<button hlmDropdownMenuItem>
								<ng-icon name="lucideShare" />
								{{ _t()['shareProject'] }}
							</button>
							<hlm-dropdown-menu-separator />
							<button hlmDropdownMenuItem>
								<ng-icon name="lucideTrash2" />
								{{ _t()['deleteProject'] }}
							</button>
						</hlm-dropdown-menu>
					</ng-template>
				</hlm-sidebar-content>
				<hlm-sidebar-footer>
					<ul hlmSidebarMenu>
						<li hlmSidebarMenuItem>
							<button
								hlmSidebarMenuButton
								size="lg"
								[hlmDropdownMenuTrigger]="avatarMenu"
								[side]="_menuSide()"
								align="end"
							>
								<hlm-avatar class="rounded-lg">
									<img src="/assets/avatar.png" alt="spartan" hlmAvatarImage />
									<span class="rounded-lg bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
								</hlm-avatar>
								<div class="grid flex-1 text-start text-sm leading-tight">
									<span class="truncate font-medium">spartan</span>
									<span class="truncate text-xs">hello@spartan.com</span>
								</div>
								<ng-icon name="lucideChevronsUpDown" class="ms-auto text-base" />
							</button>
						</li>
					</ul>

					<ng-template #avatarMenu>
						<hlm-dropdown-menu class="min-w-56 rounded-lg">
							<hlm-dropdown-menu-label>
								<div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
									<hlm-avatar class="rounded-lg">
										<img src="/assets/avatar.png" alt="spartan" hlmAvatarImage />
										<span class="rounded-lg bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
									</hlm-avatar>
									<div class="grid flex-1 text-start text-sm leading-tight">
										<span class="truncate font-medium">spartan</span>
										<span class="truncate text-xs">hello@spartan.com</span>
									</div>
								</div>
							</hlm-dropdown-menu-label>
							<hlm-dropdown-menu-separator />
							<hlm-dropdown-menu-group>
								<button hlmDropdownMenuItem>
									<ng-icon name="lucideSparkles" />
									{{ _t()['upgradeToPro'] }}
								</button>
							</hlm-dropdown-menu-group>
							<hlm-dropdown-menu-separator />
							<hlm-dropdown-menu-group>
								<button hlmDropdownMenuItem>
									<ng-icon name="lucideBadgeCheck" />
									{{ _t()['account'] }}
								</button>
								<button hlmDropdownMenuItem>
									<ng-icon name="lucideCreditCard" />
									{{ _t()['billing'] }}
								</button>
								<button hlmDropdownMenuItem>
									<ng-icon name="lucideBell" />
									{{ _t()['notifications'] }}
								</button>
							</hlm-dropdown-menu-group>
							<hlm-dropdown-menu-separator />
							<button hlmDropdownMenuItem>
								<ng-icon name="lucideLogOut" />
								{{ _t()['logOut'] }}
							</button>
						</hlm-dropdown-menu>
					</ng-template>
				</hlm-sidebar-footer>
			</hlm-sidebar>
			<main hlmSidebarInset>
				<header class="flex h-12 items-center justify-between gap-4 px-4">
					<button hlmSidebarTrigger><span class="sr-only"></span></button>

					<hlm-select class="inline-block" [(value)]="_languageService.language" [itemToString]="itemToString">
						<hlm-select-trigger class="w-52">
							<hlm-select-value />
						</hlm-select-trigger>
						<hlm-select-content *hlmSelectPortal [dir]="_dir()">
							<hlm-select-group>
								@for (language of languages; track language.value) {
									<hlm-select-item [value]="language.value">
										{{ language.label }}
									</hlm-select-item>
								}
							</hlm-select-group>
						</hlm-select-content>
					</hlm-select>
				</header>
				<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div class="grid auto-rows-min gap-4 md:grid-cols-3">
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
						<div class="bg-muted/50 aspect-video rounded-xl"></div>
					</div>
					<div class="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min"></div>
				</div>
			</main>
		</div>
	`,
})
export default class SidebarRtlPage {
	private readonly _sidebarService = inject(HlmSidebarService);
	protected readonly _languageService = inject(TranslateService);
	protected readonly _sidebarSide = computed(() => (this._dir() === 'rtl' ? 'right' : 'left'));
	protected readonly _menuSide = computed(() => {
		if (this._sidebarService.isMobile()) return 'top';
		return this._dir() === 'rtl' ? 'left' : 'right';
	});
	protected readonly _menuAlign = computed(() => (this._sidebarService.isMobile() ? 'end' : 'start'));

	public languages: { value: Language; label: string }[] = [
		{ value: 'en', label: 'English' },
		{ value: 'ar', label: 'Arabic (العربية)' },
		{ value: 'he', label: 'Hebrew (עברית)' },
	];

	public itemToString = (value: Language) => this.languages.find((lang) => lang.value === value)?.label ?? '';

	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				teamName: 'Acme Inc',
				teamPlan: 'Enterprise',
				platform: 'Platform',
				projects: 'Projects',
				viewProject: 'View Project',
				shareProject: 'Share Project',
				deleteProject: 'Delete Project',
				more: 'More',
				upgradeToPro: 'Upgrade to Pro',
				account: 'Account',
				billing: 'Billing',
				notifications: 'Notifications',
				logOut: 'Log out',
				playground: 'Playground',
				history: 'History',
				starred: 'Starred',
				settings: 'Settings',
				models: 'Models',
				genesis: 'Genesis',
				explorer: 'Explorer',
				quantum: 'Quantum',
				documentation: 'Documentation',
				introduction: 'Introduction',
				getStarted: 'Get Started',
				tutorials: 'Tutorials',
				changelog: 'Changelog',
				general: 'General',
				team: 'Team',
				limits: 'Limits',
				designEngineering: 'Design Engineering',
				salesMarketing: 'Sales & Marketing',
				travel: 'Travel',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				teamName: 'شركة أكمي',
				teamPlan: 'المؤسسة',
				platform: 'المنصة',
				projects: 'المشاريع',
				viewProject: 'عرض المشروع',
				shareProject: 'مشاركة المشروع',
				deleteProject: 'حذف المشروع',
				more: 'المزيد',
				upgradeToPro: 'ترقية إلى Pro',
				account: 'الحساب',
				billing: 'الفوترة',
				notifications: 'الإشعارات',
				logOut: 'تسجيل الخروج',
				playground: 'ملعب',
				history: 'السجل',
				starred: 'المميز',
				settings: 'الإعدادات',
				models: 'النماذج',
				genesis: 'جينيسيس',
				explorer: 'إكسبلورر',
				quantum: 'كوانتوم',
				documentation: 'التوثيق',
				introduction: 'مقدمة',
				getStarted: 'ابدأ',
				tutorials: 'الدروس',
				changelog: 'سجل التغييرات',
				general: 'عام',
				team: 'الفريق',
				limits: 'الحدود',
				designEngineering: 'هندسة التصميم',
				salesMarketing: 'المبيعات والتسويق',
				travel: 'السفر',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				teamName: 'אקמי בע״מ',
				teamPlan: 'ארגוני',
				platform: 'פלטפורמה',
				projects: 'פרויקטים',
				viewProject: 'הצג פרויקט',
				shareProject: 'שתף פרויקט',
				deleteProject: 'מחק פרויקט',
				more: 'עוד',
				upgradeToPro: 'שדרג ל-Pro',
				account: 'חשבון',
				billing: 'חיוב',
				notifications: 'התראות',
				logOut: 'התנתק',
				playground: 'מגרש משחקים',
				history: 'היסטוריה',
				starred: 'מועדפים',
				settings: 'הגדרות',
				models: 'מודלים',
				genesis: "ג'נסיס",
				explorer: 'אקספלורר',
				quantum: 'קוונטום',
				documentation: 'תיעוד',
				introduction: 'מבוא',
				getStarted: 'התחל',
				tutorials: 'מדריכים',
				changelog: 'יומן שינויים',
				general: 'כללי',
				team: 'צוות',
				limits: 'מגבלות',
				designEngineering: 'הנדסת עיצוב',
				salesMarketing: 'מכירות ושיווק',
				travel: 'נסיעות',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);

	protected readonly _platforms = [
		{
			titleKey: 'playground',
			url: '.',
			icon: 'lucideSquareTerminal',
			isActive: true,
			items: [
				{
					titleKey: 'history',
					url: '.',
				},
				{
					titleKey: 'starred',
					url: '.',
				},
				{
					titleKey: 'settings',
					url: '.',
				},
			],
		},
		{
			titleKey: 'models',
			url: '.',
			icon: 'lucideBot',
			items: [
				{
					titleKey: 'genesis',
					url: '.',
				},
				{
					titleKey: 'explorer',
					url: '.',
				},
				{
					titleKey: 'quantum',
					url: '.',
				},
			],
		},
		{
			titleKey: 'documentation',
			url: '.',
			icon: 'lucideBookOpen',
			items: [
				{
					titleKey: 'introduction',
					url: '.',
				},
				{
					titleKey: 'getStarted',
					url: '.',
				},
				{
					titleKey: 'tutorials',
					url: '.',
				},
				{
					titleKey: 'changelog',
					url: '.',
				},
			],
		},
		{
			titleKey: 'settings',
			url: '.',
			icon: 'lucideSettings2',
			items: [
				{
					titleKey: 'general',
					url: '.',
				},
				{
					titleKey: 'team',
					url: '.',
				},
				{
					titleKey: 'billing',
					url: '.',
				},
				{
					titleKey: 'limits',
					url: '.',
				},
			],
		},
	];

	protected readonly _projects = [
		{
			nameKey: 'designEngineering',
			url: '.',
			icon: 'lucideFrame',
		},
		{
			nameKey: 'salesMarketing',
			url: '.',
			icon: 'lucideChartPie',
		},
		{
			nameKey: 'travel',
			url: '.',
			icon: 'lucideMap',
		},
	];
}
