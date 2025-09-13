import { FocusableOption, FocusKeyManager, FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
	type AfterContentInit,
	computed,
	contentChildren,
	Directive,
	effect,
	ElementRef,
	HostListener,
	inject,
	input,
	type OnDestroy,
	signal,
	untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Directive({
	selector: '[brnAccordionItem]',
	host: {
		'[attr.data-state]': 'state()',
	},
	exportAs: 'brnAccordionItem',
})
export class BrnAccordionItem {
	private static _itemIdGenerator = 0;
	public readonly id = ++BrnAccordionItem._itemIdGenerator;
	private readonly _accordion = inject(BrnAccordion);
	/**
	 * Whether the accordion item is opened or closed.
	 * @default false
	 */
	public readonly isOpened = input<boolean, BooleanInput>(false, { transform: coerceBooleanProperty });
	public readonly state = computed(() => (this._accordion.openItemIds().includes(this.id) ? 'open' : 'closed'));

	constructor() {
		if (!this._accordion) {
			throw Error('Accordion item can only be used inside an Accordion. Add brnAccordion to ancestor.');
		}
		effect(() => {
			const isOpened = this.isOpened();
			untracked(() => {
				if (isOpened) {
					this._accordion.openItem(this.id);
				} else {
					this._accordion.closeItem(this.id);
				}
			});
		});
	}
}

@Directive({
	selector: '[brnAccordionTrigger]',
	host: {
		'[attr.data-state]': 'state()',
		'[attr.aria-expanded]': 'state() === "open"',
		'[attr.aria-controls]': 'ariaControls',
		'[id]': 'id',
		'[attr.role]': '"button"',
	},
})
export class BrnAccordionTrigger implements FocusableOption {
	private readonly _accordion = inject(BrnAccordion);
	private readonly _item = inject(BrnAccordionItem);
	private readonly _el = inject(ElementRef<HTMLElement>);

	public readonly state = this._item.state;
	public readonly id = `brn-accordion-trigger-${this._item.id}`;
	public readonly ariaControls = `brn-accordion-content-${this._item.id}`;
	constructor() {
		if (!this._accordion) throw Error('Accordion trigger requires a parent Accordion.');
		if (!this._item) throw Error('Accordion trigger requires a parent AccordionItem.');
		this.validateAriaStructure();

		fromEvent(this._el.nativeElement, 'focus')
			.pipe(takeUntilDestroyed())
			.subscribe(() => {
				this._accordion.setActiveItem(this);
			});
	}

	@HostListener('click', ['$event'])
	@HostListener('keyup.space', ['$event'])
	@HostListener('keyup.enter', ['$event'])
	protected toggle(event: Event): void {
		event.preventDefault();
		this._accordion.toggleItem(this._item.id);
	}

	public focus() {
		this._el.nativeElement.focus();
	}

	private validateAriaStructure(): void {
		const element = this._el.nativeElement;

		const isButton = element.tagName === 'BUTTON';
		const hasButtonRole = element.getAttribute('role') === 'button';

		if (!isButton && !hasButtonRole) {
			throw Error(
				`BrnAccordionTrigger: The trigger element must be a <button> or have role="button". ` +
					`Found: <${element.tagName.toLowerCase()}>`,
			);
		}

		const parent = element.parentElement;
		if (!parent) {
			throw Error('BrnAccordionTrigger: The trigger button must be wrapped in a heading element.');
		}

		const isNativeHeading = /^H[1-6]$/.test(parent.tagName);
		const hasHeadingRole = parent.getAttribute('role') === 'heading';

		if (!isNativeHeading && !hasHeadingRole) {
			throw Error(
				`BrnAccordionTrigger: The trigger button must be wrapped in a heading element ` +
					`(h1-h6) or an element with role="heading". Found parent: <${parent.tagName.toLowerCase()}>`,
			);
		}

		if (hasHeadingRole && !parent.hasAttribute('aria-level')) {
			throw Error('BrnAccordionTrigger: Elements with role="heading" must have an aria-level attribute.');
		}
	}
}

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
	host: {
		'[attr.data-state]': 'state()',
		'[attr.data-orientation]': 'orientation()',
	},
	exportAs: 'brnAccordion',
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

	public triggers = contentChildren(BrnAccordionTrigger, { descendants: true });

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
