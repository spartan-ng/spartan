import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-hover-card-rtl-preview',
	imports: [HlmHoverCardImports, HlmButtonImports, HlmIconImports, HlmAvatarImports, NgIcon],
	providers: [Directionality, provideIcons({ lucideCalendar })],
	host: {
		class: 'flex w-full justify-center',
		'[dir]': '_dir()',
	},
	template: `
		<hlm-hover-card>
			<button hlmBtn variant="link" hlmHoverCardTrigger>&#64;analogjs</button>
			<hlm-hover-card-content *hlmHoverCardPortal class="w-80">
				<div class="flex justify-between gap-4">
					<hlm-avatar size="sm">
						<img src="https://analogjs.org/img/logos/analog-logo.svg" alt="AnalogLogo" hlmAvatarImage />
						<span class="bg-red-600 text-red-800" hlmAvatarFallback>AN</span>
					</hlm-avatar>
					<div class="space-y-1">
						<h4 class="text-sm font-semibold">&#64;analogjs</h4>
						<p class="text-sm">{{ _t()['description'] }}</p>
						<div class="flex items-center pt-2">
							<ng-icon hlm size="sm" name="lucideCalendar" class="me-2 opacity-70" />
							<span class="text-muted-foreground text-xs">{{ _t()['joined'] }}</span>
						</div>
					</div>
				</div>
			</hlm-hover-card-content>
		</hlm-hover-card>
	`,
})
export class HoverCardRtlPreview {
	private readonly _directionality = inject(Directionality);
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				description: 'The Angular meta-framework – build Angular applications faster.',
				joined: 'Joined December 2021',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				description: 'إطار العمل الوصفي لـ Angular – أنشئ تطبيقات Angular بشكل أسرع.',
				joined: 'انضم في ديسمبر 2021',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				description: 'מטא-פריימוורק של Angular – בנה אפליקציות Angular מהר יותר.',
				joined: 'הצטרף בדצמבר 2021',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);

	constructor() {
		effect(() => {
			const dir = this._dir();
			untracked(() => this._directionality.valueSignal.set(dir));
		});
	}
}
