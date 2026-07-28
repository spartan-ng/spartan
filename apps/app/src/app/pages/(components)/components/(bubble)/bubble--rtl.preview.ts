import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';

@Component({
	selector: 'spartan-bubble-rtl-preview',
	imports: [HlmBubbleImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'theme-blue flex w-full max-w-sm flex-col gap-8',
	},
	template: `
		<div class="flex w-full flex-col gap-8" [dir]="_dir()">
			<div hlmBubble variant="muted">
				<div hlmBubbleContent>{{ _t()['start'] }}</div>
			</div>
			<div hlmBubble align="end">
				<div hlmBubbleContent>{{ _t()['end'] }}</div>
				<div hlmBubbleReactions role="img" [attr.aria-label]="_t()['reactionLabel']">
					<span>👍</span>
				</div>
			</div>
		</div>
	`,
})
export class BubbleRtlPreview {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				start: 'This bubble is aligned to the start. This is the default alignment.',
				end: 'This bubble is aligned to the end. Use this for user messages.',
				reactionLabel: 'Reaction: thumbs up',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				start: 'هذه الفقاعة محاذاة إلى البداية. هذا هو المحاذاة الافتراضية.',
				end: 'هذه الفقاعة محاذاة إلى النهاية. استخدم هذا لرسائل المستخدم.',
				reactionLabel: 'تفاعل: إبهام لأعلى',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				start: 'הבועה הזו מיושרת להתחלה. זוהי היישור ברירת המחדל.',
				end: 'הבועה הזו מיושרת לסוף. השתמש בזה להודעות משתמש.',
				reactionLabel: 'תגובה: אגודל למעלה',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
