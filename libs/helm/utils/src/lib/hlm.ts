import { isPlatformBrowser } from '@angular/common';
import {
	afterRenderEffect,
	DestroyRef,
	effect,
	ElementRef,
	HostAttributeToken,
	inject,
	Injector,
	PLATFORM_ID,
	untracked,
} from '@angular/core';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function hlm(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Global map to track class managers per element
const elementClassManagers = new WeakMap<HTMLElement, ElementClassManager>();

interface ElementClassManager {
	element: HTMLElement;
	sources: Map<symbol, { classes: Set<string>; order: number }>;
	baseClasses: Set<string>;
	isUpdating: boolean;
	observer: MutationObserver | null;
	nextOrder: number;
	hasInitialized: boolean;
}

/**
 * This function dynamically adds and removes classes for a given element without requiring
 * the a class binding (e.g. `[class]="..."`) which may interfere with other class bindings.
 *
 * 1. This will merge the existing classes on the element with the new classes.
 * 2. It will also remove any classes that were previously added by this function but are no longer present in the new classes.
 * 3. Multiple calls to this function on the same element will be merged efficiently.
 */
export function classes(computed: () => ClassValue[] | string, options: ClassesOptions = {}) {
	// get the ElementRef from the options or injector - this is a bit of a dance to avoid
	// needing the injector if the ElementRef is provided directly
	const injector = options.injector ?? inject(Injector);
	const elementRef = options.elementRef ?? injector.get<ElementRef<HTMLElement>>(ElementRef);
	const platformId = injector.get(PLATFORM_ID);
	const destroyRef = injector.get(DestroyRef);
	const baseClasses = inject(new HostAttributeToken('class'), { optional: true });

	const element = elementRef.nativeElement;

	// Create unique identifier for this source
	const sourceId = Symbol('classes-source');

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
			sources: new Map(),
			baseClasses: initialBaseClasses,
			isUpdating: false,
			observer: null,
			nextOrder: 0,
			hasInitialized: false,
		};
		elementClassManagers.set(element, manager);

		// Setup shared observer and effect for this element
		setupElementManagement(manager, platformId);
	}

	// Assign order once at registration time
	const sourceOrder = manager.nextOrder++;

	function updateClasses(): void {
		// Get the new classes from the computed function
		const newClasses = toClassList(computed());

		// Update this source's classes, keeping the original order
		manager!.sources.set(sourceId, {
			classes: new Set(newClasses),
			order: sourceOrder,
		});

		// Update the element
		updateElement(manager!);
	}

	// Register cleanup with DestroyRef
	destroyRef.onDestroy(() => {
		// Remove this source from the manager
		manager!.sources.delete(sourceId);

		// If no more sources, clean up the manager
		if (manager!.sources.size === 0) {
			cleanupManager(element, manager!);
		} else {
			// Update element without this source's classes
			updateElement(manager!);
		}
	});

	// Each source needs its own effect to track its computed function
	afterRenderEffect({ write: () => updateClasses() });

	/**
	 * This runs in an effect so that inputs are set before setting the initial classes.
	 * This is untracked to avoid double execution since the afterRenderEffect already tracks changes.
	 * We need this as well because afterRenderEffect is more appropriate for DOM writes, but it doesn't
	 * run in SSR environments.
	 */
	effect(() => untracked(() => updateClasses()));
}

function setupElementManagement(manager: ElementClassManager, platformId: Object): void {
	if (isPlatformBrowser(platformId)) {
		// Setup single observer for this element
		manager.observer = new MutationObserver(() => {
			if (manager.isUpdating) return; // Ignore changes we're making

			// Update base classes to include any externally added classes
			const currentClasses = toClassList(manager.element.className);
			const allSourceClasses = new Set<string>();

			// Collect all classes from all sources
			for (const source of manager.sources.values()) {
				source.classes.forEach((className) => allSourceClasses.add(className));
			}

			// Any classes not from sources become new base classes
			manager.baseClasses.clear();
			currentClasses.forEach((className) => {
				if (!allSourceClasses.has(className)) {
					manager.baseClasses.add(className);
				}
			});

			updateElement(manager);
		});

		// Start observing the element for class attribute changes
		manager.observer.observe(manager.element, {
			attributes: true,
			attributeFilter: ['class'],
		});
	}
}

function updateElement(manager: ElementClassManager): void {
	if (manager.isUpdating) return; // Prevent recursive updates

	manager.isUpdating = true;

	// Temporarily disconnect observer to prevent infinite loops
	if (manager.observer) {
		manager.observer.disconnect();
	}

	// Handle initialization: capture base classes after first source registration
	if (!manager.hasInitialized && manager.sources.size > 0) {
		// Get current classes on element (may include SSR classes)
		const currentClasses = toClassList(manager.element.className);

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
	}

	// Get classes from all sources, sorted by registration order (later takes precedence)
	const sortedSources = Array.from(manager.sources.entries()).sort(([, a], [, b]) => a.order - b.order);

	const allSourceClasses: string[] = [];
	for (const [, source] of sortedSources) {
		allSourceClasses.push(...source.classes);
	}

	// Combine base classes with all source classes, ensuring base classes take precedence
	const classesToApply = twMerge(clsx([...allSourceClasses, ...manager.baseClasses]));

	// Apply the classes to the element
	if (manager.element.className !== classesToApply) {
		manager.element.className = classesToApply;
	}

	// Reconnect observer
	if (manager.observer) {
		manager.observer.observe(manager.element, {
			attributes: true,
			attributeFilter: ['class'],
		});
	}

	manager.isUpdating = false;
}

function cleanupManager(element: HTMLElement, manager: ElementClassManager): void {
	// Clean up observer
	if (manager.observer) {
		manager.observer.disconnect();
	}

	// Remove from global map
	elementClassManagers.delete(element);
}

interface ClassesOptions {
	elementRef?: ElementRef<HTMLElement>;
	injector?: Injector;
}

function toClassList(className: string | ClassValue[]): string[] {
	return clsx(className)
		.split(' ')
		.filter((c) => c.length > 0);
}
