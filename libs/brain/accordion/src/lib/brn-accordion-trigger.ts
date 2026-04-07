import type { FocusableOption } from '@angular/cdk/a11y';
import { computed, DestroyRef, Directive, ElementRef, inject, isDevMode } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { injectBrnAccordion, injectBrnAccordionItem } from './brn-accordion-token';

@Directive({
	selector: 'button[brnAccordionTrigger]',
	host: {
		'[id]': 'id',
		type: 'button',
		tabindex: '0',
		'[attr.data-orientation]': '_orientation()',
		'[attr.data-state]': '_state()',
		'[attr.aria-expanded]': '_isExpanded()',
		'[attr.aria-controls]': 'ariaControls',
		'[attr.aria-disabled]': '_disabled()',
		'[disabled]': '_disabled()',
		'(click)': 'toggle($event)',
		'(keyup.space)': 'toggle($event)',
		'(keyup.enter)': 'toggle($event)',
	},
})
export class BrnAccordionTrigger implements FocusableOption {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _accordion = injectBrnAccordion();
	private readonly _item = injectBrnAccordionItem();
	private readonly _el = inject(ElementRef<HTMLElement>);

	protected readonly _orientation = this._accordion.orientation;
	protected readonly _state = this._item.state;
	protected readonly _isExpanded = computed(() => this._item.state() === 'open');
	protected readonly _disabled = this._item.disabled;
	public readonly id = `brn-accordion-trigger-${this._item.id}`;
	public readonly ariaControls = `brn-accordion-content-${this._item.id}`;

	public get disabled() {
		return this._disabled();
	}

	constructor() {
		if (!this._accordion) throw Error('Accordion trigger requires a parent Accordion.');
		if (!this._item) throw Error('Accordion trigger requires a parent AccordionItem.');

		this._accordion.registerTrigger(this);

		this._destroyRef.onDestroy(() => this._accordion.unregisterTrigger(this));

		this.validateAriaStructure();

		fromEvent(this._el.nativeElement, 'focus')
			.pipe(takeUntilDestroyed())
			.subscribe(() => {
				this._accordion.setActiveItem(this);
			});
	}

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
			const message = 'BrnAccordionTrigger: The trigger button must be wrapped in a heading element.';
			if (isDevMode()) {
				throw Error(message);
			} else {
				console.warn(message);
			}
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
