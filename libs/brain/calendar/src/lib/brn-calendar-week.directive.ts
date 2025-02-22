import {
	ChangeDetectorRef,
	Directive,
	EmbeddedViewRef,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
	computed,
	effect,
	inject,
	untracked,
} from '@angular/core';
import { injectBrnCalendar } from './brn-calendar.token';

@Directive({
	standalone: true,
	selector: '[brnCalendarWeek]',
})
export class BrnCalendarWeekDirective<T> implements OnDestroy {
	/** Access the calendar */
	private readonly _calendar = injectBrnCalendar<T>();

	/** Access the view container ref */
	private readonly _viewContainerRef = inject(ViewContainerRef);

	/** Access the change detector */
	private readonly _changeDetector = inject(ChangeDetectorRef);

	/** Access the template ref */
	private readonly _templateRef = inject<TemplateRef<BrnWeekContext<T>>>(TemplateRef);

	// get the weeks to display.
	protected readonly weeks = computed(() => {
		const days = this._calendar.days();
		const weeks = [];

		for (let i = 0; i < days.length; i += 7) {
			weeks.push(days.slice(i, i + 7));
		}

		return weeks;
	});

	/** Store the view refs */
	private readonly _viewRefs: EmbeddedViewRef<BrnWeekContext<T>>[] = [];

	// Make sure the template checker knows the type of the context with which the
	// template of this directive will be rendered
	static ngTemplateContextGuard<T>(_: BrnCalendarWeekDirective<T>, ctx: unknown): ctx is BrnWeekContext<T> {
		return true;
	}

	constructor() {
		// this should use `afterRenderEffect` but it's not available in the current version
		effect(() => {
			const weeks = this.weeks();
			untracked(() => this._renderWeeks(weeks));
		});
	}

	private _renderWeeks(weeks: T[][]): void {
		// Destroy all the views when the directive is destroyed
		for (const viewRef of this._viewRefs) {
			viewRef.destroy();
		}

		this._viewRefs.length = 0;

		// Create a new view for each week
		for (const week of weeks) {
			const viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, {
				$implicit: week,
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

interface BrnWeekContext<T> {
	$implicit: T[];
}
