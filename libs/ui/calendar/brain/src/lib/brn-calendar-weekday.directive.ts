import { Directive, EmbeddedViewRef, OnDestroy, TemplateRef, ViewContainerRef, computed, inject } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/ui-date-time';
import { injectCalendar } from './brn-calendar.token';

@Directive({
	standalone: true,
	selector: '[brnCalendarWeekday]',
})
export class BrnCalendarWeekdayDirective<T> implements OnDestroy {
	/** Access the calendar */
	private readonly calendar = injectCalendar<T>();

	/** Access the date time adapter */
	private readonly dateAdapter = injectDateAdapter<T>();

	/** Access the view container ref */
	private readonly viewContainerRef = inject(ViewContainerRef);

	/** Access the template ref */
	private readonly templateRef = inject<TemplateRef<BrnWeekdayContext>>(TemplateRef);

	/** Get the days of the week to display in the header. */
	protected readonly weekdays = computed(() => this.calendar.days().slice(0, 7));

	/** Store the view refs */
	private readonly viewRefs: EmbeddedViewRef<BrnWeekdayContext>[] = [];

	// Make sure the template checker knows the type of the context with which the
	// template of this directive will be rendered
	static ngTemplateContextGuard<T>(_: BrnCalendarWeekdayDirective<T>, ctx: unknown): ctx is BrnWeekdayContext {
		return true;
	}

	constructor() {
		// Create a new view for each day
		for (const day of this.weekdays()) {
			const viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef, {
				$implicit: this.dateAdapter.getDay(day),
			});
			this.viewRefs.push(viewRef);
		}
	}

	ngOnDestroy(): void {
		// Destroy all the views when the directive is destroyed
		for (const viewRef of this.viewRefs) {
			viewRef.destroy();
		}
	}
}

interface BrnWeekdayContext {
	$implicit: number;
}
