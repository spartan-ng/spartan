import {
	Directive,
	ElementRef,
	Input,
	computed,
	effect,
	inject,
	input,
	model,
	output,
	signal,
	untracked,
} from '@angular/core';

@Directive({
	selector: '[brnTabsContent]',
	standalone: true,
	host: {
		role: 'tabpanel',
		tabindex: '0',
		'[id]': 'contentId()',
		'[attr.aria-labelledby]': 'labelId()',
		'[hidden]': '_isSelected() === false',
	},
	exportAs: 'brnTabsContent',
})
export class BrnTabsContentDirective {
	private readonly _root = inject(BrnTabsDirective);
	private readonly _elementRef = inject(ElementRef);

	public readonly contentFor = input.required<string>({ alias: 'brnTabsContent' });
	protected readonly _isSelected = computed(() => this._root.$activeTab() === this.contentFor());
	protected contentId = computed(() => `brn-tabs-content-${this.contentFor()}`);
	protected labelId = computed(() => `brn-tabs-label-${this.contentFor()}`);

	constructor() {
		effect(() => {
			const contentFor = this.contentFor();
			untracked(() => this._root.registerContent(contentFor, this));
		});
	}

	public focus() {
		this._elementRef.nativeElement.focus();
	}
}

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

@Directive({
	selector: 'button[brnTabsTrigger]',
	standalone: true,
	host: {
		'[id]': 'labelId()',
		type: 'button',
		role: 'tab',
		'[tabindex]': 'selected() ? "0": "-1"',
		'[attr.aria-selected]': 'selected()',
		'[attr.aria-controls]': 'contentId()',
		'[attr.data-state]': "selected() ? 'active' : 'inactive'",
		'[attr.data-orientation]': '_orientation()',
		'[attr.data-disabled]': "disabled ? '' : undefined",
		'(click)': 'activate()',
	},
	exportAs: 'brnTabsTrigger',
})
export class BrnTabsTriggerDirective {
	public readonly elementRef = inject(ElementRef);

	private readonly _root = inject(BrnTabsDirective);

	protected readonly _orientation = this._root.$orientation;

	public readonly triggerFor = input.required<string>({ alias: 'brnTabsTrigger' });
	public readonly selected = computed(() => this._root.$activeTab() === this.triggerFor());
	protected readonly contentId = computed(() => `brn-tabs-content-${this.triggerFor()}`);
	protected readonly labelId = computed(() => `brn-tabs-label-${this.triggerFor()}`);

	// leaving this as an @input to be compatible with the `FocusKeyManager` used in the `BrnTabsListDirective`
	@Input()
	public disabled = false;

	constructor() {
		effect(() => {
			const triggerFor = this.triggerFor();
			untracked(() => this._root.registerTrigger(triggerFor, this));
		});
	}

	public focus() {
		this.elementRef.nativeElement.focus();
		if (this._root.$activationMode() === 'automatic') {
			this.activate();
		}
	}

	public activate() {
		if (!this.triggerFor()) return;
		this._root.setActiveTab(this.triggerFor());
		this._root.emitTabActivated(this.triggerFor());
	}

	public get key(): string | undefined {
		return this.triggerFor();
	}
}
