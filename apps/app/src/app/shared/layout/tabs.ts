import { Component, computed, contentChild, effect, EventEmitter, Input, input, Output } from '@angular/core';
import { BrnTabs, BrnTabsContent, BrnTabsList, BrnTabsTrigger } from '@spartan-ng/brain/tabs';
import { Code } from '../code/code';
import { OpenInStackBlitzButton } from '../stackblitz/open-in-stackblitz-button';
import { isRunnableExample } from '../stackblitz/stackblitz-project-builder.service';

export const tabBtn =
	'inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none';
export const tabContent =
	'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border border-border';
@Component({
	selector: 'spartan-tabs',
	imports: [BrnTabs, BrnTabsList, BrnTabsTrigger, BrnTabsContent, OpenInStackBlitzButton],
	host: {
		class: 'block mt-4',
	},
	template: `
		<div [brnTabs]="_tabValue()" class="block" (tabActivated)="onTabActivated($event)">
			<div
				brnTabsList
				class="border-border text-muted-foreground mb-4 inline-flex h-9 w-full items-center justify-start rounded-none border-b bg-transparent p-0"
				[attr.aria-label]="'Tablist showing ' + firstTab + ' and ' + secondTab"
			>
				<button class="${tabBtn}" [brnTabsTrigger]="firstTab">{{ firstTab }}</button>
				<button class="${tabBtn}" [brnTabsTrigger]="secondTab">{{ secondTab }}</button>
				@if (_runnableCode()) {
					<span class="ml-auto flex items-center pe-1">
						<spartan-stackblitz-button [code]="_runnableCode()" />
					</span>
				}
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

	/** The projected code panel (the "Code" tab content), used to offer a StackBlitz button. */
	private readonly _codePanel = contentChild(Code, { descendants: true });
	/** The example source when it is runnable, otherwise null (hides the toolbar button). */
	protected readonly _runnableCode = computed(() => {
		const code = this._codePanel()?.codeValue();
		return isRunnableExample(code) ? code : null;
	});

	constructor() {
		// When this tab wraps a runnable example, the toolbar hosts the StackBlitz button,
		// so tell the projected code panel to hide its own to avoid a duplicate.
		effect(() => {
			const panel = this._codePanel();
			if (panel && isRunnableExample(panel.codeValue())) {
				panel.suppressStackblitzButton();
			}
		});
	}
	@Output()
	public readonly tabActivated = new EventEmitter<string>();
	protected onTabActivated(value: string) {
		this.tabActivated.emit(value);
	}
}
