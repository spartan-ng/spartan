import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmResizableImports } from '@spartan-ng/helm/resizable';

@Component({
	selector: 'spartan-resizable-rtl-preview',
	imports: [HlmResizableImports],
	providers: [Directionality],
	host: {
		'[dir]': '_dir()',
	},
	template: `
		<hlm-resizable-group class="h-[200px] w-[500px] max-w-md rounded-lg border">
			<hlm-resizable-panel>
				<div class="flex h-full items-center justify-center p-6">{{ _t()['sidebar'] }}</div>
			</hlm-resizable-panel>
			<hlm-resizable-handle />
			<hlm-resizable-panel>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">{{ _t()['content'] }}</span>
				</div>
			</hlm-resizable-panel>
		</hlm-resizable-group>
	`,
})
export class ResizableRtlPreview {
	private readonly _directionality = inject(Directionality);
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				sidebar: 'Sidebar',
				content: 'Content',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				sidebar: 'الشريط الجانبي',
				content: 'المحتوى',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				sidebar: 'סרגל צד',
				content: 'תוכן',
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
