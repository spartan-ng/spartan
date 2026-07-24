import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
	selector: 'spartan-avatar-rtl-preview',
	imports: [HlmAvatarImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[dir]': '_dir()',
	},
	template: `
		<div class="flex flex-row flex-wrap items-center gap-6 md:gap-12">
			<hlm-avatar>
				<img
					hlmAvatarImage
					src="/assets/avatar.png"
					alt="spartan logo. Resembling a spartanic shield"
					class="grayscale"
				/>
				<span hlmAvatarFallback>RG</span>
			</hlm-avatar>
			<hlm-avatar>
				<img
					hlmAvatarImage
					src="/assets/avatar.png"
					alt="spartan logo. Resembling a spartanic shield"
					class="grayscale"
				/>
				<span hlmAvatarFallback>RG</span>
				<hlm-avatar-badge class="bg-red-600 dark:bg-red-800" />
			</hlm-avatar>
			<hlm-avatar-group class="grayscale">
				<hlm-avatar>
					<img hlmAvatarImage src="/assets/avatar.png" alt="spartan logo. Resembling a spartanic shield" />
					<span hlmAvatarFallback>RG</span>
				</hlm-avatar>
				<hlm-avatar>
					<img hlmAvatarImage src="/assets/avatar.png" alt="spartan logo. Resembling a spartanic shield" />
					<span hlmAvatarFallback>RG</span>
				</hlm-avatar>
				<hlm-avatar>
					<img hlmAvatarImage src="/assets/avatar.png" alt="spartan logo. Resembling a spartanic shield" />
					<span hlmAvatarFallback>RG</span>
				</hlm-avatar>
				<hlm-avatar-group-count>{{ _t()['moreUsers'] }}</hlm-avatar-group-count>
			</hlm-avatar-group>
		</div>
	`,
})
export class AvatarRtlPreview {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				moreUsers: '+3',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				moreUsers: '+٣',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				moreUsers: '+3',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
