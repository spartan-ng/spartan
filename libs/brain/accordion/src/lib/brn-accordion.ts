import { FocusKeyManager, FocusMonitor } from '@angular/cdk/a11y';
import {
	type AfterContentInit,
	computed,
	contentChildren,
	Directive,
	ElementRef,
	inject,
	input,
	type OnDestroy,
	signal,
} from '@angular/core';
import { provideBrnAccordion } from './brn-accordion-token';
import { BrnAccordionTrigger } from './brn-accordion-trigger';

const HORIZONTAL_KEYS_TO_PREVENT_DEFAULT = [
	'ArrowLeft',
	'ArrowRight',
	'PageDown',
	'PageUp',
	'Home',
	'End',
	' ',
	'Enter',
] as const;

const VERTICAL_KEYS_TO_PREVENT_DEFAULT = [
	'ArrowUp',
	'ArrowDown',
	'PageDown',
	'PageUp',
	'Home',
	'End',
	' ',
	'Enter',
] as const;

@Directive({
	selector: '[brnAccordion]',
	exportAs: 'brnAccordion',
	providers: [provideBrnAccordion(BrnAccordion)],
	host: {
		'[attr.data-state]': 'state()',
		'[attr.data-orientation]': 'orientation()',
	},
})
export class BrnAccordion implements AfterContentInit, OnDestroy {
	private readonly _el = inject(ElementRef<HTMLElement>);
	private readonly _focusMonitor = inject(FocusMonitor);
	private readonly _keyManager = computed(() =>
		new FocusKeyManager<BrnAccordionTrigger>(this.triggers())
			.withHomeAndEnd()
			.withPageUpDown()
			.withWrap()
			.withHorizontalOrientation(this.orientation() === 'vertical' ? null : (this.dir() ?? 'ltr'))
			.withVerticalOrientation(this.orientation() === 'vertical'),
	);

	private readonly _focused = signal<boolean>(false);
	private readonly _openItemIds = signal<number[]>([]);
	public readonly openItemIds = this._openItemIds.asReadonly();
	public readonly state = computed(() => (this._openItemIds().length > 0 ? 'open' : 'closed'));

	public readonly triggers = contentChildren(BrnAccordionTrigger, { descendants: true });

	/**
	 * Whether the accordion is in single or multiple mode.
	 * @default 'single'
	 */
	public readonly type = input<'single' | 'multiple'>('single');
	/**
	 * The direction of the accordion, either 'ltr' (left-to-right) or 'rtl' (right-to-left).
	 * @default null
	 */
	public readonly dir = input<'ltr' | 'rtl' | null>(null);
	/**
	 * The orientation of the accordion, either 'horizontal' or 'vertical'.
	 * @default 'vertical'
	 */
	public readonly orientation = input<'horizontal' | 'vertical'>('vertical');

	public ngAfterContentInit() {
		this._el.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {
			if (this.shouldIgnoreEvent(event)) return;
			this._keyManager()?.onKeydown(event);
			this.preventDefaultEvents(event);
		});
		this._focusMonitor.monitor(this._el, true).subscribe((origin) => this._focused.set(origin !== null));
	}

	ngOnDestroy(): void {
		this._focusMonitor.stopMonitoring(this._el);
	}

	public setActiveItem(item: BrnAccordionTrigger) {
		this._keyManager()?.setActiveItem(item);
	}

	public toggleItem(id: number) {
		if (this._openItemIds().includes(id)) {
			this.closeItem(id);
			return;
		}
		this.openItem(id);
	}

	public openItem(id: number) {
		if (this.type() === 'single') {
			this._openItemIds.set([id]);
			return;
		}
		this._openItemIds.update((ids) => (ids.includes(id) ? ids : [...ids, id]));
	}

	public closeItem(id: number) {
		this._openItemIds.update((ids) => ids.filter((openId) => openId !== id));
	}

	private isEditableTarget(el: EventTarget | null): boolean {
		const node = el as HTMLElement | null;
		if (!node) return false;

		const tag = node.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
		if (node.isContentEditable) return true;

		const role = node.getAttribute?.('role') ?? '';
		if (/^(textbox|searchbox|combobox|listbox|grid|tree|menu|spinbutton|slider)$/.test(role)) return true;

		const editableAncestor = node.closest?.(
			'input, textarea, select, [contenteditable=""], [contenteditable="true"], ' +
				'[role="textbox"], [role="searchbox"], [role="combobox"], [role="listbox"], ' +
				'[role="grid"], [role="tree"], [role="menu"], [role="spinbutton"], [role="slider"]',
		);
		return !!editableAncestor;
	}

	private shouldIgnoreEvent(e: KeyboardEvent): boolean {
		if (e.defaultPrevented) return true; // another handler already acted
		if (e.ctrlKey || e.metaKey || e.altKey) return true; // let shortcuts through
		return this.isEditableTarget(e.target); // don't steal from editable/ARIA widgets
	}

	private preventDefaultEvents(event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		if (!this._focused()) return;
		if (!('key' in event)) return;

		const keys: readonly string[] =
			this.orientation() === 'horizontal' ? HORIZONTAL_KEYS_TO_PREVENT_DEFAULT : VERTICAL_KEYS_TO_PREVENT_DEFAULT;

		if (keys.includes(event.key) && event.code !== 'NumpadEnter') {
			event.preventDefault();
		}
	}
}
