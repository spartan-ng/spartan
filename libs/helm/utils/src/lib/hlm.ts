import { isPlatformBrowser } from '@angular/common';
import { afterRenderEffect, ElementRef, inject, Injector, PLATFORM_ID } from '@angular/core';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function hlm(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Global map to track all observers per element
const elementObservers = new WeakMap<HTMLElement, Set<MutationObserver>>();

/**
 * This function dynamically adds and removes classes for a given element without requiring
 * the a class binding (e.g. `[class]="..."`) which may interfere with other class bindings.
 *
 * 1. This will merge the existing classes on the element with the new classes.
 * 2. It will also remove any classes that were previously added by this function but are no longer present in the new classes.
 * 3. It will order classes so that any transition-related classes are at the end to ensure proper application of transitions.
 */
export function classes(computed: () => ClassValue[] | string, options: ClassesOptions = {}) {
	// get the ElementRef from the options or injector - this is a bit of a dance to avoid
	// needing the injector if the ElementRef is provided directly
	const elementRef =
		options.elementRef ?? (options.injector ?? inject(Injector)).get<ElementRef<HTMLElement>>(ElementRef);
	const platformId = (options.injector ?? inject(Injector)).get(PLATFORM_ID);

	// store the previously added classes so we can remove them later
	const previousClasses = new Set<string>();

	// MutationObserver reference and debounce timer
	let observer: MutationObserver | null = null;
	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

	function updateClasses(): void {
		// temporarily disconnect ALL observers for this element to prevent infinite loops
		const element = elementRef.nativeElement;
		const observers = elementObservers.get(element);
		if (observers) {
			observers.forEach((obs) => obs.disconnect());
		}

		// get the current classes on the element
		let classList = toClassList(elementRef.nativeElement.className);

		// remove previously added classes from this list so we get just the list of classes that
		// were not added by this function (i.e. user classes or classes added by other means - like routerLinkActive)
		classList = classList.filter((c) => !previousClasses.has(c));
		previousClasses.clear();

		// get the new classes from the computed function - this will be tracked because it's called
		// from a reactive effect
		const newClasses = toClassList(computed());

		// add the new classes to the previousClasses set for the next update
		newClasses.forEach((className) => previousClasses.add(className));

		// determine the complete set of classes to apply, ensuring the users classes take precedence
		const classesToApply = twMerge(clsx([...newClasses, ...classList]));

		// sort the classes so that transition related classes are at the end
		const sortedClasses = classesToApply
			.split(' ')
			.sort((a, b) => {
				const aIsTransition = a.startsWith('transition');
				const bIsTransition = b.startsWith('transition');
				if (aIsTransition && !bIsTransition) {
					return 1;
				} else if (!aIsTransition && bIsTransition) {
					return -1;
				} else {
					return 0;
				}
			})
			.join(' ');

		// apply the classes to the element
		if (elementRef.nativeElement.className !== sortedClasses) {
			elementRef.nativeElement.className = sortedClasses;
		}

		// reconnect ALL observers for this element
		if (observers) {
			observers.forEach((obs) => {
				obs.observe(element, {
					attributes: true,
					attributeFilter: ['class'],
				});
			});
		}
	}

	if (isPlatformBrowser(platformId)) {
		const element = elementRef.nativeElement;

		// listen for external changes to the class attribute
		observer = new MutationObserver(() => {
			// clear any pending debounce
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}

			// debounce the update to avoid rapid-fire changes
			console.debug('Detected external class change, updating classes...');
			updateClasses();
		});

		// register this observer in the global map
		if (!elementObservers.has(element)) {
			elementObservers.set(element, new Set());
		}
		elementObservers.get(element)!.add(observer);

		// start observing the element for class attribute changes
		observer.observe(element, {
			attributes: true,
			attributeFilter: ['class'],
		});
	}

	// any time the computed classes change, run the update during the write phase
	// this function does read the classes from the element, but that does not incur
	// any layout thrashing, but we are going to update the classes, so write seems
	// the most appropriate place
	afterRenderEffect({ write: updateClasses });

	// initial update
	updateClasses();
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
