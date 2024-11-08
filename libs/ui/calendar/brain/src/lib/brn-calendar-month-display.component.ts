import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, type TemplateRef, computed, inject, input } from '@angular/core';
import { BrnCalendarService } from './brn-calendar.service';

@Component({
	selector: 'brn-calendar-month-display',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	template: `<tbody role="rowgroup">
            @for(monthRow of months(); track $index){
                <tr class="flex w-full mt-2">
                    @for(month of monthRow; let idx = $index; track $index + idx){
                        @if(monthTemplate()){
                            <ng-container *ngTemplateOutlet="monthTemplate() ?? null; context: { $implicit: month.name, index:month.index }"/>
                        } @else {
                            <td><button>{{month}}</button></td>
                        }
                    }
                </tr>
            }
        </tbody>
    `,
})
export class BrnCalendarMonthDisplayComponent {
	private brnCalendarService = inject(BrnCalendarService);

	protected months = computed(() => this.brnCalendarService.months());

	readonly monthTemplate = input<TemplateRef<{ $implicit: string; index: number }>>();

	constructor() {
		this.brnCalendarService.generateMonthsArray();
	}
}
