import { BooleanInput } from '@angular/cdk/coercion';
import {
	Directive,
	ElementRef,
	OnDestroy,
	booleanAttribute,
	computed,
	effect,
	inject,
	input,
	untracked,
} from '@angular/core';
import { BrnTabsDirective } from './brn-tabs.directive';

@Directive({
	selector: 'button[brnTabsTrigger]',
	host: {
		'[id]': 'labelId()',
		type: 'button',
		role: 'tab',
		'[tabindex]': 'selected() ? "0": "-1"',
		'[attr.aria-selected]': 'selected()',
		'[attr.aria-controls]': 'contentId()',
		'[attr.data-state]': "selected() ? 'active' : 'inactive'",
		'[attr.data-orientation]': '_orientation()',
		'[attr.data-disabled]': "_disabled() ? '' : undefined",
		'[attr.disabled]': "_disabled() ? '' : undefined",
		'(click)': 'activate()',
	},
	exportAs: 'brnTabsTrigger',
})
export class BrnTabsTriggerDirective implements OnDestroy {
	public readonly elementRef = inject(ElementRef);

	private readonly _root = inject(BrnTabsDirective);

	protected readonly _orientation = this._root.$orientation;

	public readonly triggerFor = input.required<string>({ alias: 'brnTabsTrigger' });
	public readonly selected = computed(() => this._root.$activeTab() === this.triggerFor());
	protected readonly contentId = computed(() => `brn-tabs-content-${this.triggerFor()}`);
	protected readonly labelId = computed(() => `brn-tabs-label-${this.triggerFor()}`);

	public readonly _disabled = input<boolean, BooleanInput>(false, {
		alias: 'disabled',
		transform: booleanAttribute,
	});
	public get disabled(): boolean | undefined {
		return this._disabled();
	}

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

	ngOnDestroy(): void {
		this._root.unregisterTrigger(this.triggerFor());
	}
}
