import { Directive, input, model, output, signal } from '@angular/core';
import { BrnTabsContentDirective } from './brn-tabs-content.directive';
import { BrnTabsTriggerDirective } from './brn-tabs-trigger.directive';

export type BrnTabsOrientation = 'horizontal' | 'vertical';
export type BrnTabsDirection = 'ltr' | 'rtl';
export type BrnActivationMode = 'automatic' | 'manual';
export type TabEntry = { trigger: BrnTabsTriggerDirective; content: BrnTabsContentDirective };

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

	private readonly _tabs = signal<{ [key: string]: TabEntry }>({});
	public readonly $tabs = this._tabs.asReadonly();

	public registerTrigger(key: string, trigger: BrnTabsTriggerDirective) {
		this.updateEntry(key, { trigger });
	}

	public registerContent(key: string, content: BrnTabsContentDirective) {
		this.updateEntry(key, { content });
	}

	public unregisterTrigger(key: string) {
		this.updateEntry(key, { trigger: undefined });
		this._activeTab.set(undefined);
	}

	public unregisterContent(key: string): void {
		this.updateEntry(key, { content: undefined });
	}

	private updateEntry(key: string, patch: Partial<TabEntry>) {
		this._tabs.update((tabs) => {
			const existing = tabs[key] ?? {};
			const merged = { ...existing, ...patch };
			const entryEmpty = !merged.trigger && !merged.content;
			if (entryEmpty) {
				const { [key]: removed, ...rest } = tabs;
				return rest;
			}
			return { ...tabs, [key]: merged };
		});
	}

	emitTabActivated(key: string) {
		this.tabActivated.emit(key);
	}

	setActiveTab(key: string) {
		this._activeTab.set(key);
	}
}
