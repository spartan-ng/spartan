import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Component, computed, input, model } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/brain/popover';
import { HlmCalendarComponent } from '@spartan-ng/ui-calendar-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import type { ClassValue } from 'clsx';
import { DateTime } from 'luxon';

// TODO make date picker work with forms
@Component({
	selector: 'hlm-date-picker',
	standalone: true,
	imports: [
		NgIcon,
		HlmIconDirective,
		BrnPopoverComponent,
		BrnPopoverTriggerDirective,
		BrnPopoverContentDirective,
		HlmPopoverContentDirective,
		HlmCalendarComponent,
	],
	providers: [provideIcons({ lucideCalendar })],
	template: `
		<brn-popover sideOffset="5" closeDelay="100">
			<button type="button" [class]="_computedClass()" [disabled]="disabled()" brnPopoverTrigger>
				<ng-icon hlm size="sm" name="lucideCalendar" />

				@if (formatedDate()) {
					{{ formatedDate() }}
				} @else {
					<ng-content />
				}
			</button>

			<div hlmPopoverContent class="w-auto p-0" *brnPopoverContent="let ctx">
				<hlm-calendar [(date)]="date" [min]="min()" [max]="max()" [disabled]="disabled()" />
			</div>
		</brn-popover>
	`,
})
export class HlmDatePickerComponent<T> {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[280px] justify-start text-left font-normal',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			'disabled:pointer-events-none disabled:opacity-50',
			'[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
			this.date() === undefined ? 'text-muted-foreground' : '',
			this.userClass(),
		),
	);

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/* * The maximum date that can be selected. */
	public readonly max = input<T>();

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	public readonly date = model<T>();

	// TODO how to use dateFormat with date adapter?!
	public readonly dateFormat = input<string>('MMMM d, yyyy');

	protected readonly formatedDate = computed(() => {
		const date = this.date();

		if (date && date instanceof Date) {
			// TODO use date adapter instead of luxon directly
			return DateTime.fromJSDate(date).toFormat(this.dateFormat());
		}
		return undefined;
	});
}
