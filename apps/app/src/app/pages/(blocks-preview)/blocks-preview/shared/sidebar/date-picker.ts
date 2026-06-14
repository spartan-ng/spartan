import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-date-picker',
	imports: [HlmSidebarImports, HlmCalendarImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sidebar-group class="px-0">
			<div hlmSidebarGroupContent>
				<hlm-calendar
					class="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]"
				/>
			</div>
		</hlm-sidebar-group>
	`,
})
export class DatePicker {}
