/**
 * Overflow values that make an element a scroll container. `hidden` is included because such an
 * element still scrolls programmatically (`scrollIntoView`, focusing a descendant), which moves the
 * anchor just as much; `clip` is not, as it does not establish a scroll container.
 */
const SCROLL_CONTAINER_OVERFLOW = /auto|scroll|overlay|hidden/;

/**
 * Returns the scroll containers that enclose `element`, from the closest outwards. The root element
 * is excluded: its overflow applies to the viewport, whose scrolling is reported on the document.
 * The walk follows the flat tree, the one that is rendered: a slotted element goes through its slot,
 * and a shadow root through its host. Must only be called in a browser.
 */
export function getScrollContainers(element: Element): Element[] {
	const view = element.ownerDocument.defaultView;
	const root = element.ownerDocument.documentElement;
	const containers: Element[] = [];
	if (!view) return containers;

	for (let current = parentOf(element); current && current !== root; current = parentOf(current)) {
		const { display, overflowX, overflowY } = view.getComputedStyle(current);
		// Overflow does not apply to inline boxes or to elements that generate no box at all.
		if (display === 'inline' || display === 'contents') continue;
		if (SCROLL_CONTAINER_OVERFLOW.test(overflowX + overflowY)) containers.push(current);
	}
	return containers;
}

function parentOf(element: Element): Element | null {
	// A slotted element's parentElement is the host, which would skip the shadow tree around the slot.
	if (element.assignedSlot) return element.assignedSlot;
	if (element.parentElement) return element.parentElement;
	const root = element.getRootNode();
	return root instanceof ShadowRoot ? root.host : null;
}
