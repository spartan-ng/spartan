import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-popover-rtl-preview',
	imports: [HlmPopoverImports, HlmButtonImports, HlmLabelImports, HlmInputImports],
	providers: [Directionality],
	host: {
		class: 'flex w-full justify-center',
		'[dir]': '_dir()',
	},
	template: `
		<hlm-popover sideOffset="5">
			<button hlmPopoverTrigger hlmBtn variant="outline">{{ _t()['open'] }}</button>
			<hlm-popover-content class="grid w-80 gap-4" *hlmPopoverPortal="let ctx">
				<div class="space-y-2">
					<h4 class="leading-none font-medium">{{ _t()['title'] }}</h4>
					<p class="text-muted-foreground text-sm">{{ _t()['description'] }}</p>
				</div>
				<div class="grid gap-2">
					<div class="grid grid-cols-3 items-center gap-4">
						<label hlmLabel for="width">{{ _t()['width'] }}</label>
						<input hlmInput id="width" [defaultValue]="'100%'" class="col-span-2 h-8" />
					</div>
					<div class="grid grid-cols-3 items-center gap-4">
						<label hlmLabel for="height">{{ _t()['height'] }}</label>
						<input hlmInput id="height" [defaultValue]="'25px'" class="col-span-2 h-8" />
					</div>
				</div>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
export class PopoverRtlPreview {
	private readonly _directionality = inject(Directionality);
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				open: 'Open popover',
				title: 'Dimensions',
				description: 'Set the dimensions for the layer.',
				width: 'Width',
				height: 'Height',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				open: 'افتح النافذة',
				title: 'الأبعاد',
				description: 'اضبط أبعاد الطبقة.',
				width: 'العرض',
				height: 'الارتفاع',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				open: 'פתח חלון',
				title: 'מידות',
				description: 'הגדר את המידות עבור השכבה.',
				width: 'רוחב',
				height: 'גובה',
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
