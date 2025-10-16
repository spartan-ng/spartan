import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { DatePickerFormRangeExample } from '@spartan-ng/app/app/pages/(components)/components/(date-picker)/date-picker--form-range.example';
import { DatePickerRangeExample } from '@spartan-ng/app/app/pages/(components)/components/(date-picker)/date-picker--range.example';
import { CodePreview } from '@spartan-ng/app/app/shared/code/code-preview';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { HlmButton } from '@spartan-ng/helm/button';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { link } from '../../../../shared/typography/link';
import { DatePickerConfigExample } from './date-picker--config.example';
import { DateAndTimePickerExample } from './date-picker--date-time.example';
import { DatePickerFormMultipleExample } from './date-picker--form-multi.example';
import { DatePickerFormExample } from './date-picker--form.example';
import { DatePickerFormatExample } from './date-picker--format.example';
import { DatePickerMultipleExample } from './date-picker--multi.example';
import { DatePickerPreview, defaultImports, defaultSkeleton } from './date-picker.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Date Picker', api: 'date-picker' },
	meta: metaWith('spartan/ui - Date Picker', 'A date picker component.'),
	title: 'spartan/ui - Date Picker',
};

@Component({
	selector: 'spartan-calendar',
	imports: [
		UIApiDocs,
		DatePickerPreview,
		SectionIntro,
		Tabs,
		Code,
		SectionSubHeading,
		TabsCli,
		PageBottomNav,
		PageBottomNavLink,
		CodePreview,
		MainSection,
		PageNav,
		DatePickerConfigExample,
		DatePickerFormatExample,
		DatePickerFormExample,
		DatePickerMultipleExample,
		DatePickerFormMultipleExample,
		DateAndTimePickerExample,
		RouterLink,
		HlmButton,
		DatePickerRangeExample,
		DatePickerFormRangeExample,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Date Picker" lead="A date picker component." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>

			<p class="${hlmP} mb-6">
				The Date Picker component is built with the
				<a routerLink="/components/popover" hlmBtn variant="link" class="${link}">Popover</a>
				and the
				<a routerLink="/components/calendar" hlmBtn variant="link" class="${link}">Calendar</a>
				components.
			</p>

			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui date-picker" ngCode="ng g @spartan-ng/cli:ui date-picker" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__custom_config" spartanH4>Custom Configs</h3>

			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">provideHlmDatePickerConfig</code>
				to provide custom configs for the date picker component throughout the application.
			</p>
			<ul class="${hlmUl}">
				<li>
					<code class="${hlmCode}">autoCloseOnSelect: boolean;</code>
					if
					<code class="${hlmCode}">true</code>
					, the date picker will close when a date is selected.
				</li>
				<li>
					<code class="${hlmCode}">formatDate: (date: T) => string;</code>
					defines the default format how the date should be displayed in the UI.
				</li>
				<li>
					<code class="${hlmCode}">transformDate: (date: T) => T;</code>
					defines the default format how the date should be transformed before saving to model/form.
				</li>
			</ul>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-config />
				</div>
				<spartan-code secondTab [code]="_configCode()" />
			</spartan-tabs>

			<h3 id="examples__multiple_selecton" spartanH4>Multiple Selection</h3>

			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">hlm-date-picker-multi</code>
				for multiple date selection. Limit the selectable dates using
				<code class="${hlmCode}">minSelection</code>
				and
				<code class="${hlmCode}">maxSelection</code>
				inputs.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-multiple />
				</div>
				<spartan-code secondTab [code]="_multiCode()" />
			</spartan-tabs>

			<h3 id="examples__range" spartanH4>Range Picker</h3>

			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">hlm-date-range-picker</code>
				for range date selection. Set the range by using
				<code class="${hlmCode}">startDate</code>
				and
				<code class="${hlmCode}">endDate</code>
				inputs.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-range />
				</div>
				<spartan-code secondTab [code]="_rangeCode()" />
			</spartan-tabs>

			<h3 id="examples__format_date" spartanH4>Format Date</h3>

			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">formatDate</code>
				input to override the global date format for the date picker component.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-format />
				</div>
				<spartan-code secondTab [code]="_formatCode()" />
			</spartan-tabs>

			<h3 id="examples__date_and_time_picker" spartanH4>Date and Time picker</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-and-time-picker />
				</div>
				<spartan-code secondTab [code]="_dateTimeCode()" />
			</spartan-tabs>

			<h3 id="examples__form" spartanH4>Form</h3>
			<p class="${hlmP} mb-6">
				Sync the date to a form by adding
				<code class="${hlmCode}">formControlName</code>
				to
				<code class="${hlmCode}">hlm-date-picker</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<h3 id="examples__form_multiple_selection" spartanH4>Form Multiple Selection</h3>
			<p class="${hlmP} mb-6">
				Sync the dates to a form by adding
				<code class="${hlmCode}">formControlName</code>
				to
				<code class="${hlmCode}">hlm-date-picker-multi</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-form-multiple />
				</div>
				<spartan-code secondTab [code]="_formMultiCode()" />
			</spartan-tabs>

			<h3 id="examples__form_range" spartanH4>Form Range Picker</h3>
			<p class="${hlmP} mb-6">
				Sync the dates to a form by adding
				<code class="${hlmCode}">formControlName</code>
				to
				<code class="${hlmCode}">hlm-date-range-picker</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-form-range />
				</div>
				<spartan-code secondTab [code]="_formRangeCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dialog" label="Dialog" />
				<spartan-page-bottom-nav-link direction="previous" href="data-table" label="Data Table" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CardPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('date-picker');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _configCode = computed(() => this._snippets()['config']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _formMultiCode = computed(() => this._snippets()['formMulti']);
	protected readonly _formRangeCode = computed(() => this._snippets()['formRange']);
	protected readonly _formatCode = computed(() => this._snippets()['format']);
	protected readonly _multiCode = computed(() => this._snippets()['multi']);
	protected readonly _rangeCode = computed(() => this._snippets()['range']);
	protected readonly _dateTimeCode = computed(() => this._snippets()['dateTime']);
	protected readonly _defaultImports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
