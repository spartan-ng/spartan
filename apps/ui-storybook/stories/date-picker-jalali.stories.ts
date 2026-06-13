import { type BrnCalendarI18n, type MonthLabels, provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { BrnJalaliDateAdapter, JalaliDate, provideDateAdapter } from '@spartan-ng/brain/date-time';
import { HlmDatePicker, HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const JALALI_MONTHS = [
	'فروردین',
	'اردیبهشت',
	'خرداد',
	'تیر',
	'مرداد',
	'شهریور',
	'مهر',
	'آبان',
	'آذر',
	'دی',
	'بهمن',
	'اسفند',
] as MonthLabels;

const jalaliCalendarI18n: BrnCalendarI18n = {
	formatWeekdayName: (i) => ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'][i],
	months: () => JALALI_MONTHS,
	years: (startYear = 1300, endYear = 1420) => Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
	formatHeader: (month, year) => JALALI_MONTHS[month] + ` ${year}`,
	formatMonth: (m) => JALALI_MONTHS[m],
	formatYear: (y) => `${y}`,
	labelPrevious: () => 'ماه قبل',
	labelNext: () => 'ماه بعد',
	labelWeekday: (i) => ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'][i],
	firstDayOfWeek: () => 6,
};

const meta: Meta<HlmDatePicker<JalaliDate>> = {
	title: 'Date Picker / Jalali (Persian)',
	component: HlmDatePicker,
	tags: ['autodocs'],
	args: {
		captionLayout: 'dropdown',
	},
	argTypes: {
		captionLayout: {
			options: ['dropdown', 'label', 'dropdown-months', 'dropdown-years'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmDatePickerImports, HlmFieldImports],
			providers: [
				provideDateAdapter(BrnJalaliDateAdapter),
				provideBrnCalendarI18n(jalaliCalendarI18n),
				provideHlmDatePickerConfig({
					formatDate: (date: JalaliDate) =>
						`${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}`,
				}),
			],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center" dir="rtl">
			<hlm-date-picker [captionLayout]="captionLayout">
                <hlm-date-picker-trigger buttonId="date-jalali">انتخاب تاریخ</hlm-date-picker-trigger>
            </hlm-date-picker>
		</div>
		`,
	}),
};

export default meta;

type Story = StoryObj<HlmDatePicker<JalaliDate>>;

export const Default: Story = {
	args: { captionLayout: 'dropdown' },
};
