import { isPlatformBrowser } from '@angular/common';
import {
	DestroyRef,
	effect,
	ElementRef,
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

interface ElementClassManager {
	element: HTMLElement;
	/** The merge function of the first source registered on this element */
	merge: BrnClassMerge;
	sources: Map<number, { classes: Set<string>; order: number }>;
	/** Classes wanted by everything except the sources, in write order; the latest write wins conflicts */
	baseClasses: Set<string>;
	isUpdating: boolean;
	nextOrder: number;
	hasInitialized: boolean;
	/** The class list this manager last wrote, to tell external class changes apart from its own. */
	appliedClasses: Set<string> | null;
	/** The className this manager last wrote; the observer skips mutations that only show it */
	writtenClassName: string | null;
	restoreRafId: number | null;
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
				baseClasses: initialBaseClasses,
				isUpdating: false,
				nextOrder: 0,
				hasInitialized: false,
				appliedClasses: null,
				writtenClassName: null,
				restoreRafId: null,
				transitionsSuppressed: false,
				previousTransition: '',
				previousTransitionPriority: '',
			};
			elementClassManagers.set(element, manager);
			trackClassList(manager);

			// Setup global observer if needed and register this element. Created outside the zone so
			// class mutations don't trigger app-wide change detection (and loop if CD writes a class).
			inject(NgZone).runOutsideAngular(() => setupGlobalObserver(platformId));
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
			manager!.sources.set(sourceId, {
				classes: new Set(newClasses),
				order: sourceOrder,
			});

			// Update the element
			updateElement(manager!);

			// Re-enable transitions after the first effect writes correct classes.
			// Deferred to next animation frame so the browser paints the class change
			// with transitions disabled first, then re-enables them.
			if (manager!.transitionsSuppressed) {
				manager!.transitionsSuppressed = false;
				manager!.restoreRafId = requestAnimationFrame(() => {
					manager!.restoreRafId = null;
					restoreTransitionSuppression(manager!);
				});
			}
		}

		// Register cleanup with DestroyRef
		destroyRef.onDestroy(() => {
			if (manager!.restoreRafId !== null) {
				cancelAnimationFrame(manager!.restoreRafId);
				manager!.restoreRafId = null;
			}

			if (manager!.transitionsSuppressed) {
				manager!.transitionsSuppressed = false;
				restoreTransitionSuppression(manager!);
			}

			// Remove this source from the manager
			manager!.sources.delete(sourceId);

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
						// Wait for the first source (its effect captures the live classes), and skip our own writes:
						// the callback runs after they're done, so only the written value tells them apart
						if (!manager.hasInitialized || element.className === manager.writtenClassName) continue;

						updateElement(manager);
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
	if (manager.isUpdating) return; // Prevent recursive updates

	manager.isUpdating = true;

	// the merge function is user-provided (e.g. createCn), never leave the manager stuck in updating mode
	try {
		applyClasses(manager);
	} finally {
		manager.isUpdating = false;
	}
}

function applyClasses(manager: ElementClassManager): void {
	// Handle initialization: capture base classes after first source registration
	if (!manager.hasInitialized && manager.sources.size > 0) {
		// Get current classes on element (may include SSR classes)
		const currentClasses = toClassList(manager.element.className);

		// A static class missing from the live element was removed externally before this first write
		for (const className of manager.baseClasses) {
			if (!currentClasses.includes(className)) {
				manager.baseClasses.delete(className);
			}
		}

		// Get all classes that will be applied by sources
		const allSourceClasses = new Set<string>();
		for (const source of manager.sources.values()) {
			source.classes.forEach((className) => allSourceClasses.add(className));
		}

		// Only consider classes as "base" if they're not produced by any source
		// This prevents SSR-rendered classes from being preserved as base classes
		currentClasses.forEach((className) => {
			if (!allSourceClasses.has(className)) {
				manager.baseClasses.add(className);
			}
		});

		manager.hasInitialized = true;
	} else if (manager.appliedClasses) {
		// Pick up a className or class attribute write before the observer reports it
		syncBaseClasses(manager);
	}

	// Get classes from all sources, sorted by registration order (later takes precedence)
	const sortedSources = Array.from(manager.sources.entries()).sort(([, a], [, b]) => a.order - b.order);

	const allSourceClasses: string[] = [];
	for (const [, source] of sortedSources) {
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
	manager.appliedClasses = new Set(toClassList(classesToApply));
	manager.writtenClassName = manager.element.className;
}

/**
 * classList writes are tracked, so the element only differs from what we wrote after a className or
 * class attribute write. Those replace the whole list, so the base classes become the live ones.
 */
function syncBaseClasses(manager: ElementClassManager): void {
	const applied = manager.appliedClasses!;
	const current = toClassList(manager.element.className);
	if (current.length === applied.size && current.every((className) => applied.has(className))) return;

	const fromSources = new Set([...applied].filter((className) => !manager.baseClasses.has(className)));
	manager.baseClasses.clear();
	for (const className of current) {
		if (!fromSources.has(className)) manager.baseClasses.add(className);
	}
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
	const native = { add: list.add, remove: list.remove };
	const wanted = manager.baseClasses;

	const write = (apply: () => void, nativeWrite: () => void) => {
		apply();
		// Until the first source runs, its effect reads the live classes, so they have to be on the element
		if (manager.hasInitialized) updateElement(manager);
		else nativeWrite();
	};

	list.add = (...tokens: string[]) =>
		write(
			() => tokens.forEach((token) => (wanted.delete(token), wanted.add(token))),
			() => native.add.apply(list, tokens),
		);
	list.remove = (...tokens: string[]) =>
		write(
			() => tokens.forEach((token) => wanted.delete(token)),
			() => native.remove.apply(list, tokens),
		);
	list.toggle = (token: string, force?: boolean) => {
		const on = force ?? !wanted.has(token);
		if (on) list.add(token);
		else list.remove(token);
		return on;
	};
	list.replace = (oldToken: string, newToken: string) => {
		if (!wanted.has(oldToken)) return false;
		list.remove(oldToken);
		list.add(newToken);
		return true;
	};
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

	// Cache results, but limit cache size to prevent memory growth
	if (classListCache.size < 1000) {
		classListCache.set(className, result);
	}

	return result;
}
