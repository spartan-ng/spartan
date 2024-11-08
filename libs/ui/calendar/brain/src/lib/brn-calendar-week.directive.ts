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
} from '@angular/core';
import { injectCalendar } from './brn-calendar.token';

@Directive({
	standalone: true,
	selector: '[brnCalendarWeek]',
})
export class BrnCalendarWeekDirective<T> implements OnDestroy {
	/** Access the calendar */
	private readonly calendar = injectCalendar<T>();

	/** Access the view container ref */
	private readonly viewContainerRef = inject(ViewContainerRef);

	/** Access the change detector */
	private readonly changeDetector = inject(ChangeDetectorRef);

	/** Access the template ref */
	private readonly templateRef = inject<TemplateRef<BrnWeekContext<T>>>(TemplateRef);

	// get the weeks to display.
	protected readonly weeks = computed(() => {
		const days = this.calendar.days();
		const weeks = [];

		for (let i = 0; i < days.length; i += 7) {
			weeks.push(days.slice(i, i + 7));
		}

		return weeks;
	});

	/** Store the view refs */
	private readonly viewRefs: EmbeddedViewRef<BrnWeekContext<T>>[] = [];

	// Make sure the template checker knows the type of the context with which the
	// template of this directive will be rendered
	static ngTemplateContextGuard<T>(_: BrnCalendarWeekDirective<T>, ctx: unknown): ctx is BrnWeekContext<T> {
		return true;
	}

	constructor() {
		// this should use `afterRenderEffect` but it's not available in the current version
		effect(() => this.renderWeek(), { allowSignalWrites: true });
	}

	private renderWeek(): void {
		// Destroy all the views when the directive is destroyed
		for (const viewRef of this.viewRefs) {
			viewRef.destroy();
		}

		this.viewRefs.length = 0;

		// Create a new view for each week
		for (const week of this.weeks()) {
			const viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef, {
				$implicit: week,
			});
			this.viewRefs.push(viewRef);
		}

		this.changeDetector.detectChanges();
	}

	ngOnDestroy(): void {
		// Destroy all the views when the directive is destroyed
		for (const viewRef of this.viewRefs) {
			viewRef.destroy();
		}
	}
}

interface BrnWeekContext<T> {
	$implicit: T[];
}
