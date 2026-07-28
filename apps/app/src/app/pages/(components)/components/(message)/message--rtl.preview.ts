import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';
import { HlmMessageImports } from '@spartan-ng/helm/message';

@Component({
	selector: 'spartan-message-rtl-preview',
	imports: [HlmMessageImports, HlmBubbleImports, HlmAvatarImports, HlmMarkerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'theme-blue flex w-full max-w-sm flex-col gap-6',
	},
	template: `
		<div class="flex w-full flex-col gap-6" [dir]="_dir()">
			<div hlmMessage align="end">
				<div hlmMessageAvatar>
					<hlm-avatar>
						<img hlmAvatarImage src="/assets/avatar.png" alt="@me" class="grayscale" />
						<span hlmAvatarFallback>ME</span>
					</hlm-avatar>
				</div>
				<div hlmMessageContent>
					<div hlmBubble>
						<div hlmBubbleContent>{{ _t()['user'] }}</div>
					</div>
					<div hlmMessageFooter>{{ _t()['delivered'] }}</div>
				</div>
			</div>

			<div hlmMessage>
				<div hlmMessageAvatar>
					<hlm-avatar>
						<img hlmAvatarImage src="https://github.com/spartan-ng.png" alt="@spartan-ng" class="grayscale" />
						<span hlmAvatarFallback>SP</span>
					</hlm-avatar>
				</div>
				<div hlmMessageContent>
					<div hlmBubble variant="muted">
						<div hlmBubbleContent>{{ _t()['assistant'] }}</div>
					</div>
				</div>
			</div>

			<div hlmMarker role="status">
				<span hlmMarkerContent class="shimmer">{{ _t()['typing'] }}</span>
			</div>
		</div>
	`,
})
export class MessageRtlPreview {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				user: "It's a one-line change.",
				delivered: 'Delivered',
				assistant: 'Alright, let me take a look.',
				typing: 'Spartan is typing...',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				user: 'إنه تغيير بسطر واحد.',
				delivered: 'تم التسليم',
				assistant: 'حسنًا، دعني ألقي نظرة.',
				typing: 'سبارتان يكتب...',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				user: 'זה שינוי של שורה אחת.',
				delivered: 'נמסר',
				assistant: 'בסדר, תן לי להסתכל.',
				typing: 'ספרטאן מקליד...',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
