/** Returns the tabbable elements inside `container`, in DOM order. Ported from Radix's navigation menu. */
export function getTabbableCandidates(container: HTMLElement): HTMLElement[] {
	const nodes: HTMLElement[] = [];
	// `.tabIndex` reflects the runtime's view of tabbability, so it covers links/buttons/[tabindex] alike.
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
		acceptNode: (node: unknown) => {
			const el = node as HTMLElement & { type?: string; disabled?: boolean };
			const isHiddenInput = el.tagName === 'INPUT' && el.type === 'hidden';
			if (el.disabled || el.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
			return el.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
		},
	});
	while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);
	return nodes;
}

/** Focuses the first candidate that can take focus; returns whether focus landed on a candidate. */
export function focusFirst(candidates: HTMLElement[]): boolean {
	const previouslyFocused = document.activeElement;
	return candidates.some((candidate) => {
		// already where we want to be - stop walking
		if (candidate === previouslyFocused) return true;
		candidate.focus();
		return document.activeElement !== previouslyFocused;
	});
}
