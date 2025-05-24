import { Directive, input, model, output, signal } from '@angular/core';
import { BrnTabsContentDirective } from './brn-tabs-content.directive';
import { BrnTabsTriggerDirective } from './brn-tabs-trigger.directive';

export type BrnTabsOrientation = 'horizontal' | 'vertical';
export type BrnTabsDirection = 'ltr' | 'rtl';
export type BrnActivationMode = 'automatic' | 'manual';

@Directive({
	selector: '[brnTabs]',
	standalone: true,
	host: {
		'[attr.data-orientation]': 'orientation()',
		'[attr.dir]': 'direction()',
	},
	exportAs: 'brnTabs',
})
export class BrnTabsDirective {
	public readonly orientation = input<BrnTabsOrientation>('horizontal');
	/** internal **/
	public $orientation = this.orientation;

	public readonly direction = input<BrnTabsDirection>('ltr');
	/** internal **/
	public $direction = this.direction;

	public readonly _activeTab = model<string | undefined>(undefined, { alias: 'brnTabs' });
	/** internal **/
	public $activeTab = this._activeTab.asReadonly();

	public readonly activationMode = input<BrnActivationMode>('automatic');
	/** internal **/
	public $activationMode = this.activationMode;

	public readonly tabActivated = output<string>();

	private readonly _tabs = signal<{
		[key: string]: { trigger: BrnTabsTriggerDirective; content: BrnTabsContentDirective };
	}>({});
	public readonly $tabs = this._tabs.asReadonly();

	public registerTrigger(key: string, trigger: BrnTabsTriggerDirective) {
		this._tabs.update((tabs) => ({ ...tabs, [key]: { trigger, content: tabs[key]?.content } }));
	}

	public registerContent(key: string, content: BrnTabsContentDirective) {
		this._tabs.update((tabs) => ({ ...tabs, [key]: { trigger: tabs[key]?.trigger, content } }));
	}

	emitTabActivated(key: string) {
		this.tabActivated.emit(key);
	}

	setActiveTab(key: string) {
		this._activeTab.set(key);
	}
}
