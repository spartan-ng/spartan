import { Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-field-rtl',
	imports: [
		HlmCheckboxImports,
		HlmTextareaImports,
		HlmButtonImports,
		HlmInputImports,
		HlmFieldImports,
		HlmSelectImports,
		ReactiveFormsModule,
	],
	host: {
		class: 'w-full max-w-md',
		'[attr.dir]': '_dir()',
	},
	template: `
		<form>
			<div hlmFieldGroup>
				<fieldset hlmFieldSet>
					<legend hlmFieldLegend>{{ _t()['paymentMethod'] }}</legend>
					<p hlmFieldDescription>{{ _t()['secureTransactions'] }}</p>

					<div hlmFieldGroup>
						<div hlmField>
							<label hlmFieldLabel for="field-preview-name-on-card">{{ _t()['nameOnCard'] }}</label>
							<input hlmInput placeholder="John Doe" id="field-preview-name-on-card" />
						</div>
						<div hlmField class="col-span-2">
							<label hlmFieldLabel for="field-preview-card-number">{{ _t()['cardNumber'] }}</label>
							<input hlmInput placeholder="1234 1234 1234 1234" id="field-preview-card-number" />
							<p hlmFieldDescription>{{ _t()['cardNumberDescription'] }}</p>
						</div>
						<div class="grid grid-cols-3 gap-4">
							<div hlmField>
								<label hlmFieldLabel for="field-exp-month--trigger">{{ _t()['month'] }}</label>
								<hlm-select id="field-exp-month" class="inline-block" [itemToString]="_monthToString">
									<hlm-select-trigger class="w-full">
										<hlm-select-value />
									</hlm-select-trigger>
									<hlm-select-content *hlmSelectPortal>
										<hlm-select-group>
											@for (month of _months(); track month.value) {
												<hlm-select-item [value]="month.value">{{ month.label }}</hlm-select-item>
											}
										</hlm-select-group>
									</hlm-select-content>
								</hlm-select>
							</div>
							<div hlmField>
								<label hlmFieldLabel for="field-exp-year--trigger">{{ _t()['year'] }}</label>
								<hlm-select id="field-exp-year" class="inline-block">
									<hlm-select-trigger class="w-full">
										<hlm-select-value />
									</hlm-select-trigger>
									<hlm-select-content *hlmSelectPortal>
										<hlm-select-group>
											@for (year of years; track year.value) {
												<hlm-select-item [value]="year.value">{{ year.label }}</hlm-select-item>
											}
										</hlm-select-group>
									</hlm-select-content>
								</hlm-select>
							</div>
							<div hlmField>
								<label hlmFieldLabel for="field-preview-cvv">{{ _t()['cvv'] }}</label>
								<input hlmInput placeholder="123" id="field-preview-cvv" />
							</div>
						</div>
					</div>
				</fieldset>
				<hlm-field-separator />
				<fieldset hlmFieldSet>
					<legend hlmFieldLegend>{{ _t()['billingAddress'] }}</legend>
					<p hlmFieldDescription>{{ _t()['billingAddressDescription'] }}</p>
					<div hlmFieldGroup>
						<div hlmField orientation="horizontal">
							<hlm-checkbox inputId="field-preview-billing-address" [checked]="true" />
							<label hlmFieldLabel for="field-preview-billing-address">{{ _t()['sameAsShipping'] }}</label>
						</div>
					</div>
				</fieldset>
				<fieldset hlmFieldSet>
					<div hlmFieldGroup>
						<div hlmField>
							<label hlmFieldLabel for="field-preview-comments">{{ _t()['comments'] }}</label>
							<textarea
								hlmTextarea
								class="resize-none"
								id="field-preview-comments"
								[placeholder]="_t()['commentsPlaceholder']"
							></textarea>
						</div>
					</div>
				</fieldset>
				<div hlmField orientation="horizontal">
					<button hlmBtn>{{ _t()['submit'] }}</button>
					<button hlmBtn variant="outline">{{ _t()['cancel'] }}</button>
				</div>
			</div>
		</form>
	`,
})
export class FieldRtl {
	public control = new FormControl('', Validators.required);

	protected readonly _months = computed(() => {
		const t = this._t();
		return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => ({
			label: t[`month${m}` as keyof typeof t],
			value: m,
		}));
	});

	protected readonly _monthToString = (value: string) => this._months().find((m) => m.value === value)?.label ?? value;

	public readonly years = [
		{ label: 'YYYY', value: null },
		{ label: '2024', value: '2024' },
		{ label: '2025', value: '2025' },
		{ label: '2026', value: '2026' },
		{ label: '2027', value: '2027' },
		{ label: '2028', value: '2028' },
		{ label: '2029', value: '2029' },
	];

	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				paymentMethod: 'Payment Method',
				secureTransactions: 'All transactions are secure and encrypted',
				nameOnCard: 'Name on Card',
				cardNumber: 'Card Number',
				cardNumberDescription: 'Enter your 16-digit card number',
				month: 'Month',
				year: 'Year',
				cvv: 'CVV',
				monthPlaceholder: 'MM',
				month01: '01',
				month02: '02',
				month03: '03',
				month04: '04',
				month05: '05',
				month06: '06',
				month07: '07',
				month08: '08',
				month09: '09',
				month10: '10',
				month11: '11',
				month12: '12',
				billingAddress: 'Billing Address',
				billingAddressDescription: 'The billing address associated with your payment method',
				sameAsShipping: 'Same as shipping address',
				comments: 'Comments',
				commentsPlaceholder: 'Add any additional comments',
				submit: 'Submit',
				cancel: 'Cancel',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				paymentMethod: 'طريقة الدفع',
				secureTransactions: 'جميع المعاملات آمنة ومشفرة',
				nameOnCard: 'الاسم على البطاقة',
				cardNumber: 'رقم البطاقة',
				cardNumberDescription: 'أدخل رقم البطاقة المكون من 16 رقمًا',
				month: 'الشهر',
				year: 'السنة',
				cvv: 'CVV',
				monthPlaceholder: 'ش.ش',
				month01: '٠١',
				month02: '٠٢',
				month03: '٠٣',
				month04: '٠٤',
				month05: '٠٥',
				month06: '٠٦',
				month07: '٠٧',
				month08: '٠٨',
				month09: '٠٩',
				month10: '١٠',
				month11: '١١',
				month12: '١٢',
				billingAddress: 'عنوان الفوترة',
				billingAddressDescription: 'عنوان الفوترة المرتبط بطريقة الدفع الخاصة بك',
				sameAsShipping: 'نفس عنوان الشحن',
				comments: 'تعليقات',
				commentsPlaceholder: 'أضف أي تعليقات إضافية',
				submit: 'إرسال',
				cancel: 'إلغاء',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				paymentMethod: 'אמצעי תשלום',
				secureTransactions: 'כל העסקאות מאובטחות ומוצפנות',
				nameOnCard: 'שם על הכרטיס',
				cardNumber: 'מספר כרטיס',
				cardNumberDescription: 'הזן את מספר הכרטיס בן 16 הספרות שלך',
				month: 'חודש',
				year: 'שנה',
				cvv: 'CVV',
				monthPlaceholder: 'MM',
				month01: '01',
				month02: '02',
				month03: '03',
				month04: '04',
				month05: '05',
				month06: '06',
				month07: '07',
				month08: '08',
				month09: '09',
				month10: '10',
				month11: '11',
				month12: '12',
				billingAddress: 'כתובת חיוב',
				billingAddressDescription: 'כתובת החיוב המשויכת לאמצעי התשלום שלך',
				sameAsShipping: 'זהה לכתובת המשלוח',
				comments: 'הערות',
				commentsPlaceholder: 'הוסף הערות נוספות',
				submit: 'שלח',
				cancel: 'בטל',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation()!.values);
	protected readonly _dir = computed(() => this._translation()!.dir);
}
