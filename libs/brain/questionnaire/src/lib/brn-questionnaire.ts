import { booleanAttribute, computed, Directive, effect, ElementRef, inject, input, model, signal } from '@angular/core';
import { brnDevMode } from '@spartan-ng/brain/core';
import {
	createQuestionnaireCollection,
	getCollectionDefinitionWarnings,
	getCollectionRegistrationWarnings,
	getInitialItemName,
} from './brn-questionnaire.collection';
import { provideBrnQuestionnaire } from './brn-questionnaire.token';
import type {
	BrnItemRegistration,
	BrnPendingFocus,
	BrnQuestionnaireItemDefinition,
	BrnQuestionnaireItemStatus,
	BrnQuestionnaireShortcutMode,
} from './brn-questionnaire.types';
import {
	compareItemOrder,
	getShortcutFromKey,
	isAnswerFilled,
	isRadioTarget,
	isTextEntryTarget,
} from './brn-questionnaire.utils';

@Directive({
	selector: 'form[brnQuestionnaire]',
	exportAs: 'brnQuestionnaire',
	providers: [provideBrnQuestionnaire(BrnQuestionnaire)],
	host: {
		'[attr.data-shortcuts]': 'shortcuts() ?? null',
		// When shortcuts are enabled, keep the form focusable so letter/number keys reach
		// the root keydown handler without requiring a nested control to be focused first.
		'[attr.tabindex]': 'shortcuts() ? 0 : null',
		'[attr.novalidate]': 'noValidate() ? "" : null',
		'(keydown)': 'onKeyDown($event)',
		'(submit)': 'onSubmit($event)',
		'(reset)': 'onReset($event)',
	},
})
export class BrnQuestionnaire {
	private readonly _elementRef = inject<ElementRef<HTMLFormElement>>(ElementRef);

	public readonly items = input<readonly BrnQuestionnaireItemDefinition[] | undefined>(undefined);
	public readonly defaultItem = input<string | undefined>(undefined);
	public readonly item = model<string | null>(null);
	public readonly shortcuts = input<BrnQuestionnaireShortcutMode | null>(null);
	public readonly noValidate = input(true, { transform: booleanAttribute });

	private readonly _registrations = signal<BrnItemRegistration[]>([]);
	private readonly _domVersion = signal(0);
	private readonly _pendingFocus = signal<BrnPendingFocus | null>(null);
	private readonly _initialized = signal(false);
	private _previousActiveItemName: string | null = null;
	private readonly _activeWarnings = new Set<string>();

	private readonly _collection = computed(() => createQuestionnaireCollection(this.items()));

	private readonly _runtimeItems = computed(() => {
		this._domVersion();
		return this._registrations()
			.filter((registration) => !registration.disabled)
			.sort(compareItemOrder);
	});

	private readonly _runtimeItemByName = computed(
		() => new Map(this._runtimeItems().map((runtimeItem) => [runtimeItem.name, runtimeItem])),
	);

	protected readonly _logicalItems = computed(() => this._collection()?.enabledItems ?? this._runtimeItems());

	private readonly _currentIndex = computed(() =>
		this._logicalItems().findIndex((logicalItem) => logicalItem.name === this.item()),
	);

	public readonly activeItem = computed(() => {
		const activeItemName = this.item();
		const currentIndex = this._currentIndex();

		if (currentIndex < 0 || !activeItemName) {
			return null;
		}

		return this._runtimeItemByName().get(activeItemName) ?? null;
	});

	public readonly activeItemName = computed(() => this.item());

	public readonly activeItemRequired = computed(() => {
		const currentIndex = this._currentIndex();
		const activeItemName = this.item();

		if (currentIndex < 0) {
			return null;
		}

		const activeDefinition = activeItemName ? this._collection()?.itemByName.get(activeItemName) : undefined;

		if (activeDefinition) {
			return Boolean(activeDefinition.required);
		}

		return this.activeItem()?.required ?? false;
	});

	public readonly activeItemStatus = computed((): BrnQuestionnaireItemStatus | null => {
		const currentIndex = this._currentIndex();
		const activeItemName = this.item();

		if (currentIndex < 0) {
			return null;
		}

		return this.activeItem()?.status ?? (activeItemName ? 'unanswered' : null);
	});

	public readonly itemDefinitionByName = computed(() => this._collection()?.itemByName ?? null);

	public readonly nativeValidation = computed(() => this.noValidate() === false);

	public readonly total = computed(() => this._logicalItems().length);
	public readonly current = computed(() => {
		const currentIndex = this._currentIndex();
		return currentIndex < 0 ? 0 : currentIndex + 1;
	});
	public readonly first = computed(() => this.total() > 0 && this._currentIndex() === 0);
	public readonly last = computed(() => this.total() > 0 && this._currentIndex() === this.total() - 1);

	public readonly domVersion = this._domVersion.asReadonly();

	private readonly _orderedRegistrations = computed(() => {
		const collection = this._collection();
		const runtimeItemByName = this._runtimeItemByName();

		if (collection) {
			return collection.enabledItems.flatMap((definition) => {
				const registration = runtimeItemByName.get(definition.name);
				return registration ? [registration] : [];
			});
		}

		return this._runtimeItems();
	});

	constructor() {
		effect(() => {
			if (this._initialized()) {
				return;
			}

			const next = getInitialItemName(this._collection(), this.defaultItem());
			if (this.item() === null && next) {
				this.item.set(next);
			}
			this._initialized.set(true);
		});

		effect((onCleanup) => {
			const form = this._elementRef.nativeElement;

			if (typeof MutationObserver === 'undefined') {
				return;
			}

			const observer = new MutationObserver(() => {
				this._domVersion.update((version) => version + 1);
			});

			observer.observe(form, { childList: true, subtree: true });
			onCleanup(() => observer.disconnect());
		});

		effect(() => {
			if (!brnDevMode) {
				return;
			}

			const collection = this._collection();
			const form = this._elementRef.nativeElement;

			if (!collection || !form) {
				this._activeWarnings.clear();
				return;
			}

			const registrations = this._registrations();
			const shortcuts = this.shortcuts();
			const defaultItem = this.defaultItem();

			queueMicrotask(() => {
				const warnings = [
					...getCollectionDefinitionWarnings(collection, defaultItem),
					...getCollectionRegistrationWarnings(collection, registrations, shortcuts),
				];
				const activeWarnings = new Set(warnings);

				for (const warning of activeWarnings) {
					if (!this._activeWarnings.has(warning)) {
						console.warn(`[Questionnaire] ${warning}`);
					}
				}

				this._activeWarnings.clear();
				for (const warning of activeWarnings) {
					this._activeWarnings.add(warning);
				}
			});
		});

		effect(() => {
			const total = this.total();
			const currentIndex = this._currentIndex();
			const logicalItems = this._logicalItems();
			const activeItemName = this.item();
			const activeItem = this.activeItem();

			if (total === 0) {
				return;
			}

			if (currentIndex < 0) {
				this.setItem(logicalItems[0].name);
				return;
			}

			const pendingFocus = this._pendingFocus();
			const activeItemChanged = this._previousActiveItemName !== activeItemName;
			this._previousActiveItemName = activeItemName;

			if (!pendingFocus || pendingFocus.name !== activeItemName) {
				if (activeItemChanged) {
					this._pendingFocus.set(null);
					activeItem?.focus();
				}
				return;
			}

			if (pendingFocus.target === 'invalid') {
				activeItem?.focusInvalid();
			} else {
				activeItem?.focus();
			}

			this._pendingFocus.set(null);
		});
	}

	public registerItem(registration: BrnItemRegistration): () => void {
		this._registrations.update((currentRegistrations) => [
			...currentRegistrations.filter(
				(currentRegistration) =>
					currentRegistration.element !== registration.element && currentRegistration.name !== registration.name,
			),
			registration,
		]);

		return () => {
			this._registrations.update((currentRegistrations) =>
				currentRegistrations.filter((currentRegistration) => currentRegistration !== registration),
			);
		};
	}

	public setItem(nextItem: string, focusTarget: BrnPendingFocus['target'] = 'item'): void {
		if (nextItem === this.item()) {
			return;
		}

		this._pendingFocus.set({ name: nextItem, target: focusTarget });
		this.item.set(nextItem);
	}

	public goPrevious(): void {
		const currentIndex = this._currentIndex();
		if (currentIndex <= 0) {
			return;
		}

		this.setItem(this._logicalItems()[currentIndex - 1].name);
	}

	public goNext(): void {
		const activeItem = this.activeItem();
		const currentIndex = this._currentIndex();
		const total = this.total();

		if (!activeItem || currentIndex >= total - 1) {
			return;
		}

		if (!activeItem.validate()) {
			activeItem.focusInvalid();
			return;
		}

		this.setItem(this._logicalItems()[currentIndex + 1].name);
	}

	public confirmCurrent(): void {
		const activeItem = this.activeItem();

		if (!activeItem) {
			return;
		}

		if (!activeItem.validate()) {
			activeItem.focusInvalid();
			return;
		}

		if (this.last()) {
			this._elementRef.nativeElement.requestSubmit();
			return;
		}

		this.setItem(this._logicalItems()[this._currentIndex() + 1].name);
	}

	public skipCurrent(): void {
		const activeItem = this.activeItem();

		if (!activeItem || activeItem.required) {
			return;
		}

		activeItem.skip();

		if (!this.last()) {
			this.setItem(this._logicalItems()[this._currentIndex() + 1].name);
			return;
		}

		queueMicrotask(() => {
			this._elementRef.nativeElement.requestSubmit();
		});
	}

	protected onReset(event: Event): void {
		if (event.defaultPrevented) {
			return;
		}

		for (const registration of this._registrations()) {
			registration.reset();
		}

		const collection = this._collection();
		const runtimeItems = this._runtimeItems();
		const defaultItem = this.defaultItem();

		const resetItemName = collection
			? getInitialItemName(collection, defaultItem)
			: (runtimeItems.find((registration) => registration.name === defaultItem)?.name ?? runtimeItems[0]?.name);

		if (resetItemName) {
			this.setItem(resetItemName);
		}
	}

	protected onSubmit(event: Event): void {
		const firstInvalidItem = this._orderedRegistrations().find((registration) => !registration.validate());

		if (!firstInvalidItem) {
			return;
		}

		event.preventDefault();
		this.setItem(firstInvalidItem.name, 'invalid');

		if (firstInvalidItem.name === this.item()) {
			firstInvalidItem.focusInvalid();
			this._pendingFocus.set(null);
		}
	}

	protected onKeyDown(event: KeyboardEvent): void {
		const activeItem = this.activeItem();

		if (
			event.defaultPrevented ||
			event.isComposing ||
			event.keyCode === 229 ||
			!activeItem ||
			!(event.target instanceof Element)
		) {
			return;
		}

		if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey) {
			event.preventDefault();

			if (!event.repeat) {
				this.confirmCurrent();
			}

			return;
		}

		if (event.metaKey || event.ctrlKey || event.altKey) {
			return;
		}

		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			const moved = activeItem.moveAnswerFocus(event.target, event.key === 'ArrowDown' ? 'next' : 'previous');

			if (moved) {
				event.preventDefault();
				return;
			}
		}

		if (
			(event.key === 'ArrowLeft' || event.key === 'ArrowRight') &&
			!isTextEntryTarget(event.target) &&
			!isRadioTarget(event.target)
		) {
			event.preventDefault();

			if (event.repeat) {
				return;
			}

			if (event.key === 'ArrowLeft') {
				this.goPrevious();
			} else if (activeItem.status !== 'unanswered') {
				this.goNext();
			}

			return;
		}

		if (event.key === 'Enter') {
			const answer = activeItem.getAnswerByElement(event.target);

			if (!answer) {
				return;
			}

			event.preventDefault();

			if (!event.repeat && isAnswerFilled(answer)) {
				this.confirmCurrent();
			}

			return;
		}

		const shortcuts = this.shortcuts();

		if (!shortcuts || isTextEntryTarget(event.target)) {
			return;
		}

		const shortcut = getShortcutFromKey(event.key, shortcuts);
		const answer = shortcut ? activeItem.getAnswerByShortcut(shortcut) : null;

		if (!answer) {
			return;
		}

		event.preventDefault();

		if (event.repeat) {
			return;
		}

		answer.element.focus();

		if (answer.type === 'choice') {
			answer.element.click();
		}
	}
}
