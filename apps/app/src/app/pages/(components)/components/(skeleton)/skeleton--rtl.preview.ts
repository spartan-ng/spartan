import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
	selector: 'spartan-skeleton-rtl',
	imports: [HlmSkeletonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-fit items-center gap-4" [dir]="_dir()">
			<hlm-skeleton class="size-10 shrink-0 rounded-full" />
			<div class="grid gap-2">
				<hlm-skeleton class="h-4 w-[150px]" />
				<hlm-skeleton class="h-4 w-[100px]" />
			</div>
		</div>
	`,
})
export class SkeletonRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {},
		},
		ar: {
			dir: 'rtl',
			values: {},
		},
		he: {
			dir: 'rtl',
			values: {},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _dir = computed(() => this._translation().dir);
}
