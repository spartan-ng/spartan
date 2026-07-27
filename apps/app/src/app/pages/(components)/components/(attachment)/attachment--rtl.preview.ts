import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileCode, lucideX } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';

@Component({
	selector: 'spartan-attachment-rtl-preview',
	imports: [HlmAttachmentImports, NgIcon],
	providers: [provideIcons({ lucideFileCode, lucideX })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'theme-blue bg-surface dark:bg-background flex w-full max-w-sm flex-col gap-3',
	},
	template: `
		<div class="flex w-full flex-col gap-3" [dir]="_dir()">
			<div hlmAttachment class="w-full">
				<div hlmAttachmentMedia>
					<ng-icon name="lucideFileCode" />
				</div>
				<div hlmAttachmentContent>
					<span hlmAttachmentTitle>{{ _t()['title'] }}</span>
					<span hlmAttachmentDescription>{{ _t()['description'] }}</span>
				</div>
				<div hlmAttachmentActions>
					<button hlmAttachmentAction [attr.aria-label]="_t()['remove']">
						<ng-icon name="lucideX" />
					</button>
				</div>
			</div>

			<div hlmAttachment orientation="vertical">
				<div hlmAttachmentMedia variant="image">
					<img
						src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
						[alt]="_t()['imageAlt']"
					/>
				</div>
				<div hlmAttachmentContent>
					<span hlmAttachmentTitle>{{ _t()['imageTitle'] }}</span>
					<span hlmAttachmentDescription>{{ _t()['imageMeta'] }}</span>
				</div>
				<div hlmAttachmentActions>
					<button hlmAttachmentAction [attr.aria-label]="_t()['remove']">
						<ng-icon name="lucideX" />
					</button>
				</div>
			</div>
		</div>
	`,
})
export class AttachmentRtlPreview {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				title: 'message-renderer.tsx',
				description: 'TypeScript · 12 KB',
				remove: 'Remove attachment',
				imageTitle: 'workspace.png',
				imageMeta: 'PNG · 820 KB',
				imageAlt: 'Workspace',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				title: 'message-renderer.tsx',
				description: 'TypeScript · 12 كيلوبايت',
				remove: 'إزالة المرفق',
				imageTitle: 'workspace.png',
				imageMeta: 'PNG · 820 كيلوبايت',
				imageAlt: 'مساحة العمل',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				title: 'message-renderer.tsx',
				description: 'TypeScript · 12 ק״ב',
				remove: 'הסר קובץ מצורף',
				imageTitle: 'workspace.png',
				imageMeta: 'PNG · 820 ק״ב',
				imageAlt: 'סביבת עבודה',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
