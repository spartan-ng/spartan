import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

@Component({
	selector: 'spartan-empty-rtl',
	imports: [NgIcon, HlmButton, HlmEmptyImports],
	providers: [provideIcons({ lucideFolderCode, lucideArrowUpRight })],
	template: `
		<hlm-empty [dir]="_dir()">
			<hlm-empty-header>
				<hlm-empty-media variant="icon">
					<ng-icon name="lucideFolderCode" />
				</hlm-empty-media>
				<div hlmEmptyTitle>{{ _t()['title'] }}</div>
				<div hlmEmptyDescription>
					{{ _t()['description'] }}
				</div>
			</hlm-empty-header>
			<hlm-empty-content class="flex-row justify-center gap-2">
				<button hlmBtn>{{ _t()['createProject'] }}</button>
				<button hlmBtn variant="outline">{{ _t()['importProject'] }}</button>
			</hlm-empty-content>
			<a href="#" hlmBtn class="text-muted-foreground" variant="link" size="sm">
				{{ _t()['learnMore'] }}
				<ng-icon name="lucideArrowUpRight" class="rtl:rotate-270" />
			</a>
		</hlm-empty>
	`,
})
export class EmptyRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				title: 'No Projects Yet',
				description: "You haven't created any projects yet. Get started by creating your first project.",
				createProject: 'Create Project',
				importProject: 'Import Project',
				learnMore: 'Learn More',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				title: 'لا توجد مشاريع بعد',
				description: 'لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.',
				createProject: 'إنشاء مشروع',
				importProject: 'استيراد مشروع',
				learnMore: 'تعرف على المزيد',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				title: 'אין פרויקטים עדיין',
				description: 'עדיין לא יצרת פרויקטים. התחל על ידי יצירת הפרויקט הראשון שלך.',
				createProject: 'צור פרויקט',
				importProject: 'ייבא פרויקט',
				learnMore: 'למד עוד',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
