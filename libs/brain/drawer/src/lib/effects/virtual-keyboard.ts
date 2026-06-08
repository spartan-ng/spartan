import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, signal, type Signal } from '@angular/core';

/**
 * Detects virtual-keyboard visibility and height.
 * Sets the `--keyboard-inset-height` CSS variable on the container element
 * (or `<html>` by default) so layouts can respond to the soft keyboard.
 *
 * Must be called in injection context.
 */
export function trackVirtualKeyboard(
	options: {
		containerRef?: () => HTMLElement | null;
		isEnabled?: boolean;
		visualViewportThreshold?: number;
		includeContentEditable?: boolean;
		debounceDelay?: number;
	} = {},
): { isKeyboardOpen: Signal<boolean>; keyboardHeight: Signal<number> } {
	const {
		containerRef,
		isEnabled = true,
		debounceDelay = 100,
		includeContentEditable = true,
		visualViewportThreshold = 100,
	} = options;

	const doc = inject(DOCUMENT);
	const destroyRef = inject(DestroyRef);
	const win = doc.defaultView;

	const isKeyboardOpen = signal(false);
	const keyboardHeight = signal(0);

	let focusedElement: HTMLElement | null = null;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	function isTextInput(el: Element | null): boolean {
		return (
			el?.tagName === 'INPUT' ||
			el?.tagName === 'TEXTAREA' ||
			(includeContentEditable && el instanceof HTMLElement && el.isContentEditable)
		);
	}

	if (!isEnabled || !win) {
		return {
			isKeyboardOpen: isKeyboardOpen.asReadonly(),
			keyboardHeight: keyboardHeight.asReadonly(),
		};
	}

	// After the guard above, `win` is guaranteed non-null.
	// Re-bind to a const so closures retain the narrowed type.
	const window = win;

	const vv = window.visualViewport;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const vk = (window.navigator as any).virtualKeyboard;

	function setKeyboardInsetHeightEnv(height: number): void {
		const element = containerRef?.() || doc.documentElement;

		// Virtual Keyboard API is only available in secure context
		if (window.isSecureContext) {
			element.style.setProperty('--keyboard-inset-height', `env(keyboard-inset-height, ${height}px)`);
		} else {
			element.style.setProperty('--keyboard-inset-height', `${height}px`);
		}
	}

	function handleFocusIn(e: FocusEvent): void {
		if (e.target instanceof HTMLElement && isTextInput(e.target)) {
			focusedElement = e.target;
			updateKeyboardState();
		}
	}

	function handleFocusOut(): void {
		focusedElement = null;
		updateKeyboardState();
	}

	function updateKeyboardState(): void {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		debounceTimer = setTimeout(() => {
			const active = focusedElement;
			const inputIsFocused = isTextInput(active);

			if (!inputIsFocused) {
				setKeyboardInsetHeightEnv(0);
				isKeyboardOpen.set(false);
				keyboardHeight.set(0);
				return;
			}

			if (vv) {
				const heightDiff = window.innerHeight - vv.height;

				if (heightDiff > visualViewportThreshold) {
					setKeyboardInsetHeightEnv(heightDiff);
					isKeyboardOpen.set(true);
					keyboardHeight.set(heightDiff);
				} else {
					setKeyboardInsetHeightEnv(0);
					isKeyboardOpen.set(false);
					keyboardHeight.set(0);
				}
			}
		}, debounceDelay);
	}

	window.addEventListener('focusin', handleFocusIn);
	window.addEventListener('focusout', handleFocusOut);

	if (vv) {
		vv.addEventListener('resize', updateKeyboardState);
		vv.addEventListener('scroll', updateKeyboardState);
	}

	let currentOverlaysContent = false;

	if (vk) {
		currentOverlaysContent = vk.overlaysContent;
		vk.overlaysContent = true;
	}

	destroyRef.onDestroy(() => {
		window.removeEventListener('focusin', handleFocusIn);
		window.removeEventListener('focusout', handleFocusOut);

		if (vv) {
			vv.removeEventListener('resize', updateKeyboardState);
			vv.removeEventListener('scroll', updateKeyboardState);
		}

		if (vk) {
			vk.overlaysContent = currentOverlaysContent;
		}

		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
	});

	return {
		isKeyboardOpen: isKeyboardOpen.asReadonly(),
		keyboardHeight: keyboardHeight.asReadonly(),
	};
}
