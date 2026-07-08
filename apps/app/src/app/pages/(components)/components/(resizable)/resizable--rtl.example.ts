import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmResizableImports } from '@spartan-ng/helm/resizable';

@Component({
	selector: 'spartan-resizable-rtl-preview',
	imports: [HlmResizableImports],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'min-w-xs',
		'[dir]': '_dir()',
	},
	template: `
		<hlm-resizable-group class="max-w-md rounded-lg border">
			<hlm-resizable-panel defaultSize="50">
				<div class="flex h-[200px] items-center justify-center p-6">
					<span class="font-semibold">{{ _t()['one'] }}</span>
				</div>
			</hlm-resizable-panel>
			<hlm-resizable-handle withHandle />
			<hlm-resizable-panel defaultSize="50">
				<hlm-resizable-group direction="vertical">
					<hlm-resizable-panel defaultSize="25">
						<div class="flex h-full items-center justify-center p-6">
							<span class="font-semibold">{{ _t()['two'] }}</span>
						</div>
					</hlm-resizable-panel>
					<hlm-resizable-handle withHandle />
					<hlm-resizable-panel defaultSize="75">
						<div class="flex h-full items-center justify-center p-6">
							<span class="font-semibold">{{ _t()['three'] }}</span>
						</div>
					</hlm-resizable-panel>
				</hlm-resizable-group>
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
				one: 'One',
				two: 'Two',
				three: 'Three',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				one: 'واحد',
				two: 'اثنان',
				three: 'ثلاثة',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				one: 'אחד',
				two: 'שניים',
				three: 'שלושה',
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
