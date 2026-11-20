import { isPlatformBrowser } from '@angular/common';
import {
	DestroyRef,
	effect,
	ElementRef,
	ErrorHandler,
	HostAttributeToken,
	inject,
	Injector,
	NgZone,
	PLATFORM_ID,
	runInInjectionContext,
} from '@angular/core';
import type { BrnClassValue } from './brn-class-value';
import { cssClassesToArray } from './css-classes-to-array';

/** Merges class values into a single class string, resolving Tailwind conflicts (e.g. `hlm`). */
export type BrnClassMerge = (...inputs: BrnClassValue[]) => string;

export interface BrnClassesOptions {
	/** The function used to merge the classes, typically `hlm` from `@spartan-ng/helm/utils`. */
	merge: BrnClassMerge;
	elementRef?: ElementRef<HTMLElement>;
	injector?: Injector;
}

// Global map to track class managers per element
const elementClassManagers = new WeakMap<HTMLElement, ElementClassManager>();
// Global mutation observer for all elements
let globalObserver: MutationObserver | null = null;
const observedElements = new Set<HTMLElement>();
// Managers whose suppressed transitions are restored in the next frame, all in one callback
const pendingTransitionRestores = new Set<ElementClassManager>();
let transitionRestoreRafId: number | null = null;

interface ClassSource {
	classes: Set<string>;
	order: number;
}

interface ElementClassManager {
	element: HTMLElement;
	/** The merge function of the first source registered on this element */
	merge: BrnClassMerge;
	sources: Map<number, ClassSource>;
	/** The sources by registration order, reset when a source is added or removed */
	sortedSources: ClassSource[] | null;
	/** Classes wanted by everything except the sources, in write order; the latest write wins conflicts */
	baseClasses: Set<string>;
	/** A classList write is waiting for the batched merge */
	updateQueued: boolean;
	errorHandler: ErrorHandler | null;
	zone: NgZone;
	nextOrder: number;
	/** The className as brnClasses last left it (null until the first source runs); a difference is an outside write */
	writtenClassName: string | null;
	/** Transitions are suppressed until the first effect writes correct classes */
	transitionsSuppressed: boolean;
	/** Original inline transition value to restore after suppression (empty string = none was set) */
	previousTransition: string;
	/** Original inline transition priority to preserve !important when restoring */
	previousTransitionPriority: string;
}

let sourceCounter = 0;

/**
 * This function dynamically adds and removes classes for a given element without requiring
 * the a class binding (e.g. `[class]="..."`) which may interfere with other class bindings.
 *
 * 1. This will merge the existing classes on the element with the new classes.
 * 2. It will also remove any classes that were previously added by this function but are no longer present in the new classes.
 * 3. Multiple calls to this function on the same element will be merged efficiently.
 *
 * The classes are merged with `options.merge`, so a customized merge function (e.g. one created
 * with `createCn` from `cn/config`) is respected.
 */
export function brnClasses(computed: () => BrnClassValue[] | string, options: BrnClassesOptions) {
	runInInjectionContext(options.injector ?? inject(Injector), () => {
		const elementRef = options.elementRef ?? inject(ElementRef);
		const platformId = inject(PLATFORM_ID);
		const destroyRef = inject(DestroyRef);
		const baseClasses = inject(new HostAttributeToken('class'), { optional: true });

		const element = elementRef.nativeElement;

		// Create unique identifier for this source
		const sourceId = sourceCounter++;

		// Get or create the class manager for this element
		let manager = elementClassManagers.get(element);

		if (!manager) {
			// Initialize base classes from variation (host attribute 'class')
			const initialBaseClasses = new Set<string>();

			if (baseClasses) {
				toClassList(baseClasses).forEach((cls) => initialBaseClasses.add(cls));
			}

			manager = {
				element,
				merge: options.merge,
				sources: new Map(),
				sortedSources: null,
				baseClasses: initialBaseClasses,
				updateQueued: false,
				errorHandler: inject(ErrorHandler, { optional: true }),
				zone: inject(NgZone),
				nextOrder: 0,
				writtenClassName: null,
				transitionsSuppressed: false,
				previousTransition: '',
				previousTransitionPriority: '',
			};
			elementClassManagers.set(element, manager);
			trackClassList(manager);

			// Setup global observer if needed and register this element. Created outside the zone so
			// class mutations don't trigger app-wide change detection (and loop if CD writes a class).
			manager.zone.runOutsideAngular(() => setupGlobalObserver(platformId));
			observedElements.add(element);

			// Suppress transitions until the first effect writes correct classes and
			// the browser has painted them. This prevents CSS transition animations
			// during hydration when classes change from SSR state to client state.
			if (isPlatformBrowser(platformId)) {
				manager.previousTransition = element.style.getPropertyValue('transition');
				manager.previousTransitionPriority = element.style.getPropertyPriority('transition');
				element.style.setProperty('transition', 'none', 'important');
				manager.transitionsSuppressed = true;
			}
		}

		// Assign order once at registration time
		const sourceOrder = manager.nextOrder++;

		function updateClasses(): void {
			// Get the new classes from the computed function, the merge function resolves arrays and objects
			const value = computed();
			const newClasses = toClassList(typeof value === 'string' ? value : options.merge(value));

			// Update this source's classes, keeping the original order
			const source = manager!.sources.get(sourceId);
			if (source) {
				source.classes = new Set(newClasses);
			} else {
				manager!.sources.set(sourceId, { classes: new Set(newClasses), order: sourceOrder });
				manager!.sortedSources = null;
			}

			// Update the element
			updateElement(manager!);

			// Re-enable transitions after the first effect writes correct classes.
			// Deferred to next animation frame so the browser paints the class change
			// with transitions disabled first, then re-enables them.
			if (manager!.transitionsSuppressed) {
				manager!.transitionsSuppressed = false;
				scheduleTransitionRestore(manager!);
			}
		}

		// Register cleanup with DestroyRef
		destroyRef.onDestroy(() => {
			if (pendingTransitionRestores.delete(manager!)) {
				restoreTransitionSuppression(manager!);
			}

			if (manager!.transitionsSuppressed) {
				manager!.transitionsSuppressed = false;
				restoreTransitionSuppression(manager!);
			}

			// Remove this source from the manager
			manager!.sources.delete(sourceId);
			manager!.sortedSources = null;

			// If no more sources, clean up the manager
			if (manager!.sources.size === 0) {
				cleanupManager(element);
			} else {
				// Update element without this source's classes
				updateElement(manager!);
			}
		});

		/**
		 * We need this effect to track changes to the computed classes. Ideally, we would use
		 * afterRenderEffect here, but that doesn't run in SSR contexts, so we use a standard
		 * effect which works in both browser and SSR.
		 */
		effect(updateClasses);
	});
}

function scheduleTransitionRestore(manager: ElementClassManager): void {
	pendingTransitionRestores.add(manager);
	transitionRestoreRafId ??= requestAnimationFrame(() => {
		transitionRestoreRafId = null;
		for (const pending of pendingTransitionRestores) {
			restoreTransitionSuppression(pending);
		}
		pendingTransitionRestores.clear();
	});
}

function restoreTransitionSuppression(manager: ElementClassManager): void {
	const prev = manager.previousTransition;
	if (prev) {
		manager.element.style.setProperty('transition', prev, manager.previousTransitionPriority || undefined);
	} else {
		manager.element.style.removeProperty('transition');
	}
}

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
function setupGlobalObserver(platformId: Object): void {
	if (isPlatformBrowser(platformId) && !globalObserver) {
		// Create single global observer that watches the entire document
		globalObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					const element = mutation.target as HTMLElement;
					const manager = elementClassManagers.get(element);

					// Only process elements we're managing
					if (manager && observedElements.has(element)) {
						// Wait for the first source (it adopts the live classes), and skip our own writes:
						// the callback runs after they're done, so only the written value tells them apart
						if (manager.writtenClassName === null || element.className === manager.writtenClassName) continue;

						scheduleUpdate(manager);
					}
				}
			}
		});

		// Start observing the entire document for class attribute changes
		globalObserver.observe(document, {
			attributes: true,
			attributeFilter: ['class'],
			subtree: true, // Watch all descendants
		});
	}
}

function updateElement(manager: ElementClassManager): void {
	adoptOutsideWrite(manager);
	// After adopting: this merge is the one adopting queued
	manager.updateQueued = false;

	// Get classes from all sources, sorted by registration order (later takes precedence)
	manager.sortedSources ??= Array.from(manager.sources.values()).sort((a, b) => a.order - b.order);

	const allSourceClasses: string[] = [];
	for (const source of manager.sortedSources) {
		allSourceClasses.push(...source.classes);
	}

	// Combine base classes with all source classes, ensuring base classes take precedence
	const classesToApply =
		allSourceClasses.length > 0 || manager.baseClasses.size > 0
			? manager.merge([...allSourceClasses, ...manager.baseClasses])
			: '';

	// Apply the classes to the element
	if (manager.element.className !== classesToApply) {
		manager.element.className = classesToApply;
	}
	manager.writtenClassName = manager.element.className;
}

/**
 * writtenClassName is the class list as brnClasses last left it, so any difference is a className or
 * class attribute write from outside. Those replace the whole list: the wanted classes become the live
 * ones (minus what the sources put there), and a class the merge had dropped is forgotten.
 * Before the first source runs, writtenClassName is null and the live classes (including SSR) are adopted.
 */
function adoptOutsideWrite(manager: ElementClassManager): void {
	if (manager.sources.size === 0) return;
	const current = manager.element.className;
	if (current === manager.writtenClassName) return;

	// What the sources put on the element; a class that is also wanted (static or tracked) stays wanted
	const sourceOutput =
		manager.writtenClassName === null
			? [...manager.sources.values()].flatMap((source) => [...source.classes])
			: toClassList(manager.writtenClassName);
	const fromSources = new Set(sourceOutput.filter((className) => !manager.baseClasses.has(className)));

	manager.baseClasses.clear();
	for (const className of toClassList(current)) {
		if (!fromSources.has(className)) manager.baseClasses.add(className);
	}
	manager.writtenClassName = current;
	// The observer now sees nothing new, so merge from here even if the write that got us here throws
	scheduleUpdate(manager);
}

const trackedMethods = ['add', 'remove', 'toggle', 'replace'] as const;

/**
 * Angular applies `[class]` and `[class.x]` through `classList`. Recording those writes keeps every wanted
 * class, including one the merge currently drops, so it comes back once the class it lost to is removed.
 * The DOM can't tell us that: removing a class that isn't on the element changes nothing there.
 */
function trackClassList(manager: ElementClassManager): void {
	const list = manager.element.classList;
	if (!list) return;
	const native = { add: list.add, remove: list.remove, replace: list.replace };
	const wanted = manager.baseClasses;

	// Write to the DOM right away so the classList answers like the native one; only the merge is batched
	const write = (apply: () => void, nativeWrite: () => void) => {
		adoptOutsideWrite(manager);
		// Native first: it rejects invalid tokens ('', 'a b') before anything lands in the wanted set
		nativeWrite();
		apply();
		// Before the first source runs the wanted set is still kept: it decides which source classes stay wanted
		if (manager.writtenClassName === null) return;
		manager.writtenClassName = manager.element.className;
		scheduleUpdate(manager);
	};

	const add = (...tokens: string[]) =>
		write(
			() => tokens.forEach((token) => (wanted.delete(token), wanted.add(token))),
			() => native.add.apply(list, tokens),
		);
	const remove = (...tokens: string[]) =>
		write(
			() => tokens.forEach((token) => wanted.delete(token)),
			() => native.remove.apply(list, tokens),
		);
	const toggle = (token: string, force?: boolean) => {
		const on = force ?? !list.contains(token);
		if (on) add(token);
		else remove(token);
		return on;
	};
	// One native call, so both tokens are validated before anything changes
	const replace = (oldToken: string, newToken: string) => {
		let replaced = false;
		write(
			() => {
				if (!replaced) return;
				wanted.delete(oldToken);
				wanted.delete(newToken);
				wanted.add(newToken);
			},
			() => (replaced = native.replace.call(list, oldToken, newToken)),
		);
		return replaced;
	};

	// Domino (SSR) declares these read-only on the prototype, so assigning them would throw
	const overrides = { add, remove, toggle, replace };
	for (const method of trackedMethods) {
		Object.defineProperty(list, method, { value: overrides[method], configurable: true, writable: true });
	}
}

/**
 * Angular writes each class binding separately, so merging per write would run the merge once per binding.
 * One merge per element per tick still lands before paint, and keeps a throwing merge out of Angular's renderer.
 */
function scheduleUpdate(manager: ElementClassManager): void {
	if (manager.updateQueued) return;
	manager.updateQueued = true;

	// Tracked writes come from the renderer inside the zone; a microtask queued there would make zone.js
	// fire onMicrotaskEmpty again and run a second change detection pass for every class binding change
	manager.zone.runOutsideAngular(() =>
		queueMicrotask(() => {
			// A source update or cleanup in between already handled it
			if (!manager.updateQueued || elementClassManagers.get(manager.element) !== manager) return;

			updateElementOutsideAngular(manager);
		}),
	);
}

/** For batched updates (tracked writes and the observer), where nothing in Angular would catch a throwing merge */
function updateElementOutsideAngular(manager: ElementClassManager): void {
	try {
		updateElement(manager);
	} catch (error) {
		if (!manager.errorHandler) throw error;
		manager.errorHandler.handleError(error);
	}
}

function untrackClassList(element: HTMLElement): void {
	// The overrides are own properties, deleting them restores the native DOMTokenList methods
	for (const method of trackedMethods) delete (element.classList as Partial<DOMTokenList>)[method];
}

function cleanupManager(element: HTMLElement): void {
	// Remove from global tracking
	observedElements.delete(element);
	elementClassManagers.delete(element);
	untrackClassList(element);

	// If no more elements being tracked, cleanup global observer
	if (observedElements.size === 0 && globalObserver) {
		globalObserver.disconnect();
		globalObserver = null;
	}
}

// Cache for parsed class lists to avoid repeated string operations
const classListCache = new Map<string, string[]>();

function toClassList(className: string): string[] {
	// Use the cache to avoid repeated parsing
	if (classListCache.has(className)) {
		return classListCache.get(className)!;
	}

	const result = cssClassesToArray(className);

	// Cache results, but limit cache size to prevent memory growth: start over once it is full, so the
	// class strings in use now are cached rather than the first ones ever seen
	if (classListCache.size >= 1000) {
		classListCache.clear();
	}
	classListCache.set(className, result);

	return result;
}
