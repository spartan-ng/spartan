import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, type TemplateRef, computed, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnCalendarService } from './brn-calendar.service';

@Component({
	selector: 'brn-calendar-year-display',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	template: `<tbody role="rowgroup">
            @for(yearRow of years(); track $index){
                <tr class="flex w-full mt-2">
                    @for(year of yearRow; let idx = $index; track $index + idx){
                        @if(yearTemplate()){
                            <ng-container *ngTemplateOutlet="yearTemplate() ?? null; context: { $implicit: year }"/>
                        } @else {
                            <td><button>{{year}} </button></td>
                        }
                    }
                </tr>
            }
        </tbody>
    `,
})
export class BrnCalendarYearDisplayComponent {
	private _brnCalendarService = inject(BrnCalendarService);

	protected years = computed(() => this._brnCalendarService.years());
	readonly yearTemplate = input<TemplateRef<{ $implicit: number }>>();

	constructor() {
		this._brnCalendarService.previewDate$
			.pipe(takeUntilDestroyed())
			.subscribe(() => this._brnCalendarService.isView('years') && this._brnCalendarService.generateYears());
	}
}
