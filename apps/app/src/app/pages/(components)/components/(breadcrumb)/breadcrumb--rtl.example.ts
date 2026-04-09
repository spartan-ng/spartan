import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDot } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';

@Component({
	selector: 'spartan-breadcrumb-rtl',
	imports: [HlmBreadcrumbImports, NgIcon],
	providers: [provideIcons({ lucideDot })],
	host: {
		'[dir]': '_dir()',
	},
	template: `
		<nav hlmBreadcrumb>
			<ol hlmBreadcrumbList>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink link="/">{{ _t()['home'] }}</a>
				</li>
				<li hlmBreadcrumbSeparator>
					<ng-icon name="lucideDot" />
				</li>
				<li hlmBreadcrumbItem>
					<a hlmBreadcrumbLink link="/components">{{ _t()['components'] }}</a>
				</li>
				<li hlmBreadcrumbSeparator>
					<ng-icon name="lucideDot" />
				</li>
				<li hlmBreadcrumbItem>
					<span hlmBreadcrumbPage>{{ _t()['breadcrumb'] }}</span>
				</li>
			</ol>
		</nav>
	`,
})
export class BreadcrumbRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				home: 'Home',
				components: 'Components',
				documentation: 'Documentation',
				themes: 'Themes',
				github: 'GitHub',
				breadcrumb: 'Breadcrumb',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				home: 'الرئيسية',
				components: 'المكونات',
				documentation: 'التوثيق',
				themes: 'السمات',
				github: 'جيت هاب',
				breadcrumb: 'مسار التنقل',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				home: 'בית',
				components: 'רכיבים',
				documentation: 'תיעוד',
				themes: 'ערכות נושא',
				github: 'גיטהאב',
				breadcrumb: 'פירורי לחם',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
