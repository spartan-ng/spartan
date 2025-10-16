import { Component, EventEmitter, Input, Output, computed, input } from '@angular/core';
import { BrnTabs, BrnTabsContent, BrnTabsList, BrnTabsTrigger } from '@spartan-ng/brain/tabs';

const tabBtn =
	'inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none  bg-transparent text-muted-foreground shadow-none  text-base  transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none';

const tabContent =
	'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border border-border';
@Component({
	selector: 'spartan-tabs',
	imports: [BrnTabs, BrnTabsList, BrnTabsTrigger, BrnTabsContent],
	host: {
		class: 'block mt-4',
	},
	template: `
		<div [brnTabs]="_tabValue()" class="block" (tabActivated)="onTabActivated($event)">
			<div
				brnTabsList
				class="text-muted-foreground inline-flex h-9 w-full items-center justify-start gap-4 rounded-none bg-transparent p-0"
				[attr.aria-label]="'Tablist showing ' + firstTab + ' and ' + secondTab"
			>
				<button class="${tabBtn}" [brnTabsTrigger]="firstTab">{{ firstTab }}</button>
				<button class="${tabBtn}" [brnTabsTrigger]="secondTab">{{ secondTab }}</button>
			</div>
			<div class="${tabContent}" [brnTabsContent]="firstTab">
				<ng-content select="[firstTab]" />
			</div>
			<div class="${tabContent}" [brnTabsContent]="secondTab">
				<ng-content select="[secondTab]" />
			</div>
		</div>
	`,
})
export class Tabs {
	@Input()
	public firstTab = '';
	@Input()
	public secondTab = '';
	public readonly value = input('');
	protected readonly _tabValue = computed(() => (this.value() === '' ? this.firstTab : this.value()));
	@Output()
	public readonly tabActivated = new EventEmitter<string>();
	protected onTabActivated(value: string) {
		this.tabActivated.emit(value);
	}
}
