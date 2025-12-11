import {
	ChangeDetectorRef,
	computed,
	Directive,
	effect,
	type EmbeddedViewRef,
	inject,
	type OnDestroy,
	TemplateRef,
	untracked,
	ViewContainerRef,
} from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { injectBrnCalendar } from './brn-calendar.token';

@Directive({
	selector: '[brnCalendarWeekday]',
})
export class BrnCalendarWeekday<T> implements OnDestroy {
	/** Access the calendar */
	private readonly _calendar = injectBrnCalendar<T>();

	/** Access the date time adapter */
	private readonly _dateAdapter = injectDateAdapter<T>();

	/** Access the view container ref */
	private readonly _viewContainerRef = inject(ViewContainerRef);

	/** Access the change detector */
	private readonly _changeDetector = inject(ChangeDetectorRef);

	/** Access the template ref */
	private readonly _templateRef = inject<TemplateRef<BrnWeekdayContext>>(TemplateRef);

	/** Get the days of the week to display in the header. */
	protected readonly _weekdays = computed(() => this._calendar.days().slice(0, 7));

	/** Store the view refs */
	private _viewRefs: EmbeddedViewRef<BrnWeekdayContext>[] = [];

	// Make sure the template checker knows the type of the context with which the
	// template of this directive will be rendered
	static ngTemplateContextGuard<T>(_: BrnCalendarWeekday<T>, ctx: unknown): ctx is BrnWeekdayContext {
		return true;
	}

	constructor() {
		// Create a new view for each day
		effect(() => {
			// Get the weekdays to display
			const weekdays = this._weekdays();
			// Render the weekdays
			untracked(() => this._renderWeekdays(weekdays));
		});
	}

	private _renderWeekdays(weekdays: T[]): void {
		// Destroy all the views when the directive is destroyed
		for (const viewRef of this._viewRefs) {
			viewRef.destroy();
		}

		this._viewRefs = [];

		// Create a new view for each day
		for (const day of weekdays) {
			const viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, {
				$implicit: this._dateAdapter.getDay(day),
			});
			this._viewRefs.push(viewRef);
		}

		this._changeDetector.detectChanges();
	}

	ngOnDestroy(): void {
		// Destroy all the views when the directive is destroyed
		for (const viewRef of this._viewRefs) {
			viewRef.destroy();
		}
	}
}

interface BrnWeekdayContext {
	$implicit: number;
}
