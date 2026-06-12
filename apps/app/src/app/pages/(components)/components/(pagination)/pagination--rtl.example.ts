import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';

function toArabicNumerals(num: number): string {
	const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
	return num
		.toString()
		.split('')
		.map((digit) => arabicNumerals[parseInt(digit, 10)])
		.join('');
}

@Component({
	selector: 'spartan-pagination-rtl',
	imports: [HlmPaginationImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<nav hlmPagination [dir]="_dir()">
			<ul hlmPaginationContent>
				<li hlmPaginationItem>
					<hlm-pagination-previous [text]="_t()['previous']" />
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#">{{ formatNumber()(1) }}</a>
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#" isActive>{{ formatNumber()(2) }}</a>
				</li>
				<li hlmPaginationItem>
					<a hlmPaginationLink link="#">{{ formatNumber()(3) }}</a>
				</li>
				<li hlmPaginationItem>
					<hlm-pagination-ellipsis />
				</li>
				<li hlmPaginationItem>
					<hlm-pagination-next [text]="_t()['next']" />
				</li>
			</ul>
		</nav>
	`,
})
export class PaginationRtl {
	private readonly _language = inject(TranslateService).language;

	public readonly formatNumber = computed(() => {
		const lang = this._language();
		return (num: number): string => (lang === 'ar' ? toArabicNumerals(num) : num.toString());
	});

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				previous: 'Previous',
				next: 'Next',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				previous: 'السابق',
				next: 'التالي',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				previous: 'הקודם',
				next: 'הבא',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
