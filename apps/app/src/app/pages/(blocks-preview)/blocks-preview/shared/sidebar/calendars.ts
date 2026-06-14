import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-calendars',
	imports: [HlmSidebarImports, HlmCheckboxImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@for (group of calendars(); track group.name; let last = $last) {
			<hlm-sidebar-group>
				<div hlmSidebarGroupLabel>{{ group.name }}</div>
				<ul hlmSidebarMenu>
					@for (item of group.items; track item) {
						<li hlmSidebarMenuItem>
							<button
								hlmSidebarMenuButton
								class="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
								[class]="isActive(item) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''"
								(click)="toggle(item)"
							>
								<div
									class="flex size-4 shrink-0 items-center justify-center rounded-sm border"
									[class]="
										isActive(item)
											? 'bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary'
											: 'border-muted-foreground/25 opacity-50'
									"
								>
									@if (isActive(item)) {
										<svg class="size-3" viewBox="0 0 14 14" fill="none">
											<path
												d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									}
								</div>
								<span>{{ item }}</span>
							</button>
						</li>
					}
				</ul>
				@if (!last) {
					<hlm-sidebar-separator class="mx-0" />
				}
			</hlm-sidebar-group>
		}
	`,
})
export class Calendars {
	public readonly calendars = input.required<{ name: string; items: string[] }[]>();
	protected readonly _activeItems = signal<Set<string>>(new Set(['Personal', 'Work', 'Holidays']));

	protected isActive(item: string): boolean {
		return this._activeItems().has(item);
	}

	protected toggle(item: string): void {
		this._activeItems.update((set) => {
			const next = new Set(set);
			if (next.has(item)) {
				next.delete(item);
			} else {
				next.add(item);
			}
			return next;
		});
	}
}
