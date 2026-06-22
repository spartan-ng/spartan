import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown, lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';

const NAMES = ['Olivia Martin', 'Jackson Lee', 'Isabella Nguyen', 'William Kim', 'Sofia Davis', 'Liam Johnson'];

@Component({
	selector: 'spartan-collapsible-dynamic',
	imports: [HlmCollapsibleImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideChevronsUpDown, lucidePlus, lucideTrash2 })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-collapsible class="flex w-[320px] flex-col gap-2">
			<div class="flex items-center justify-between gap-4">
				<h4 class="text-sm font-semibold">Team · {{ members().length }} members</h4>
				<button hlmCollapsibleTrigger hlmBtn variant="ghost" size="icon" class="size-8">
					<ng-icon name="lucideChevronsUpDown" />
					<span class="sr-only">Toggle</span>
				</button>
			</div>

			<!-- The host's scrollHeight covers all content - the leading line and every row - so the
			height animates to fit even with this text sitting outside the rows wrapper. -->
			<hlm-collapsible-content
				class="block overflow-hidden transition-all data-[state=closed]:block data-[state=closed]:h-0 data-[state=open]:h-(--brn-collapsible-content-height)"
			>
				Everyone listed here can view and edit this project.
				<div class="mt-2 flex flex-col gap-2">
					@for (member of members(); track $index) {
						<div class="rounded-md border px-4 py-2 text-sm">{{ member }}</div>
					}
					<button hlmBtn variant="outline" size="sm" (click)="isFull() ? clear() : addMember()">
						@if (isFull()) {
							<ng-icon name="lucideTrash2" />
							Clear
						} @else {
							<ng-icon name="lucidePlus" />
							Add member
						}
					</button>
				</div>
			</hlm-collapsible-content>
		</hlm-collapsible>
	`,
})
export class CollapsibleDynamic {
	public readonly members = signal(NAMES.slice(0, 3));
	public readonly isFull = computed(() => this.members().length >= NAMES.length);

	public addMember(): void {
		const next = NAMES[this.members().length];
		if (next === undefined) return;
		this.members.update((members) => [...members, next]);
	}

	public clear(): void {
		this.members.set([]);
	}
}
