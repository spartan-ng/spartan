import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
	selector: 'spartan-stepper-rtl-preview',
	imports: [HlmStepperImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="space-y-8">
			<section class="space-y-3">
				<h4 class="text-foreground text-sm font-semibold">{{ _t().horizontal }}</h4>
				<hlm-stepper>
					<hlm-step [label]="_t().account">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								{{ _t().contentOne }}
							</div>
							<div class="flex justify-end">
								<button hlmBtn hlmStepperNext>{{ _t().next }}</button>
							</div>
						</div>
					</hlm-step>

					<hlm-step [label]="_t().address">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								{{ _t().contentTwo }}
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" hlmStepperPrevious>{{ _t().previous }}</button>
								<button hlmBtn hlmStepperNext>{{ _t().next }}</button>
							</div>
						</div>
					</hlm-step>

					<hlm-step [label]="_t().review">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								{{ _t().contentThree }}
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" hlmStepperPrevious>{{ _t().previous }}</button>
								<button hlmBtn>{{ _t().finish }}</button>
							</div>
						</div>
					</hlm-step>
				</hlm-stepper>
			</section>

			<section class="space-y-3">
				<h4 class="text-foreground text-sm font-semibold">{{ _t().vertical }}</h4>
				<hlm-stepper orientation="vertical">
					<hlm-step [label]="_t().firstStage">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								{{ _t().verticalExampleText }}
							</div>
							<div class="flex justify-start">
								<button hlmBtn hlmStepperNext>{{ _t().next }}</button>
							</div>
						</div>
					</hlm-step>

					<hlm-step [label]="_t().secondStage">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								{{ _t().rtlSupportText }}
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" hlmStepperPrevious>{{ _t().previous }}</button>
								<button hlmBtn hlmStepperNext>{{ _t().next }}</button>
							</div>
						</div>
					</hlm-step>

					<hlm-step [label]="_t().finalStage">
						<div class="flex flex-col gap-4">
							<div
								class="text-muted-foreground flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-lg font-medium"
							>
								{{ _t().readyToSubmit }}
							</div>
							<div class="flex justify-between gap-2">
								<button hlmBtn variant="outline" hlmStepperPrevious>{{ _t().previous }}</button>
								<button hlmBtn>{{ _t().finish }}</button>
							</div>
						</div>
					</hlm-step>
				</hlm-stepper>
			</section>
		</div>
	`,
	host: {
		class: 'w-full',
		'[dir]': '_dir()',
	},
})
export class StepperRtlPreview {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations = {
		en: {
			dir: 'ltr',
			values: {
				horizontal: 'Horizontal',
				account: 'Account',
				contentOne: 'Content 1',
				address: 'Address',
				contentTwo: 'Content 2',
				review: 'Review',
				contentThree: 'Content 3',
				vertical: 'Vertical',
				firstStage: 'First Stage',
				verticalExampleText: 'This is a vertical stepper example in right-to-left mode.',
				secondStage: 'Second Stage',
				rtlSupportText: 'You can use the same stepper API with RTL direction.',
				finalStage: 'Final Stage',
				readyToSubmit: 'Ready to submit.',
				next: 'Next',
				previous: 'Previous',
				finish: 'Finish',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				horizontal: 'أفقي',
				account: 'الحساب',
				contentOne: 'المحتوى ١',
				address: 'العنوان',
				contentTwo: 'المحتوى ٢',
				review: 'المراجعة',
				contentThree: 'المحتوى ٣',
				vertical: 'عمودي',
				firstStage: 'المرحلة الأولى',
				verticalExampleText: 'هذا مثال للعرض العمودي من اليمين إلى اليسار.',
				secondStage: 'المرحلة الثانية',
				rtlSupportText: 'يمكن استخدام نفس واجهة الخطوات مع اتجاه RTL.',
				finalStage: 'المرحلة الأخيرة',
				readyToSubmit: 'جاهز للإرسال.',
				next: 'التالي',
				previous: 'السابق',
				finish: 'إنهاء',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				horizontal: 'אופקי',
				account: 'חשבון',
				contentOne: 'תוכן 1',
				address: 'כתובת',
				contentTwo: 'תוכן 2',
				review: 'סקירה',
				contentThree: 'תוכן 3',
				vertical: 'אנכי',
				firstStage: 'שלב ראשון',
				verticalExampleText: 'זו דוגמה לתצוגה אנכית במצב מימין לשמאל.',
				secondStage: 'שלב שני',
				rtlSupportText: 'אפשר להשתמש באותו API של Stepper עם כיוון RTL.',
				finalStage: 'שלב אחרון',
				readyToSubmit: 'מוכן לשליחה.',
				next: 'הבא',
				previous: 'הקודם',
				finish: 'סיום',
			},
		},
	};
	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
