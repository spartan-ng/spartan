import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-input-group-rtl',
	imports: [HlmInputGroupImports, NgIcon, HlmSpinnerImports, HlmFieldImports],
	providers: [provideIcons({ lucideSearch })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'grid w-full max-w-sm gap-6' },
	template: `
		<hlm-input-group [dir]="_dir()">
			<input hlmInputGroupInput [placeholder]="_t()['placeholder']" />
			<hlm-input-group-addon>
				<ng-icon name="lucideSearch" />
			</hlm-input-group-addon>
			<hlm-input-group-addon align="inline-end">{{ _t()['results'] }}</hlm-input-group-addon>
		</hlm-input-group>

		<hlm-input-group [dir]="_dir()">
			<input hlmInputGroupInput [placeholder]="_t()['searching']" />
			<hlm-input-group-addon align="inline-end">
				<hlm-spinner />
			</hlm-input-group-addon>
		</hlm-input-group>

		<hlm-input-group [dir]="_dir()">
			<input hlmInputGroupInput [placeholder]="_t()['savingChanges']" />
			<hlm-input-group-addon align="inline-end">
				<hlm-input-group-text>{{ _t()['saving'] }}</hlm-input-group-text>
				<hlm-spinner />
			</hlm-input-group-addon>
		</hlm-input-group>

		<hlm-field-group [dir]="_dir()">
			<hlm-field>
				<label hlmFieldLabel for="rtl-textarea">{{ _t()['textareaLabel'] }}</label>
				<hlm-input-group>
					<textarea hlmInputGroupTextarea id="rtl-textarea" [placeholder]="_t()['textareaPlaceholder']"></textarea>
					<hlm-input-group-addon align="block-end">
						<hlm-input-group-text>{{ _t()['characterCount'] }}</hlm-input-group-text>
						<button hlmInputGroupButton variant="default" size="sm" class="ms-auto">{{ _t()['post'] }}</button>
					</hlm-input-group-addon>
				</hlm-input-group>
			</hlm-field>
		</hlm-field-group>
	`,
})
export class InputGroupRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				placeholder: 'Search...',
				results: '12 results',
				searching: 'Searching...',
				saving: 'Saving...',
				savingChanges: 'Saving changes...',
				textareaLabel: 'Textarea',
				textareaPlaceholder: 'Write a comment...',
				characterCount: '0/280',
				post: 'Post',
				textareaDescription: 'Footer positioned below the textarea.',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				placeholder: 'بحث...',
				results: '١٢ نتيجة',
				searching: 'جاري البحث...',
				saving: 'جاري الحفظ...',
				savingChanges: 'جاري حفظ التغييرات...',
				textareaLabel: 'منطقة النص',
				textareaPlaceholder: 'اكتب تعليقًا...',
				characterCount: '٠/٢٨٠',
				post: 'نشر',
				textareaDescription: 'تذييل موضع أسفل منطقة النص.',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				placeholder: 'חפש...',
				results: '12 תוצאות',
				searching: 'מחפש...',
				saving: 'שומר...',
				savingChanges: 'שומר שינויים...',
				textareaLabel: 'אזור טקסט',
				textareaPlaceholder: 'כתוב תגובה...',
				characterCount: '0/280',
				post: 'פרסם',
				textareaDescription: 'כותרת תחתונה ממוקמת מתחת לאזור הטקסט.',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
