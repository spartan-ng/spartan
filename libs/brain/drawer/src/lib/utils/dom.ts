// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.

export type ScrollAxis = 'horizontal' | 'vertical';

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function isElement(value: unknown): value is Element {
	return typeof Element !== 'undefined' && value instanceof Element;
}

export function isHTMLElement(value: unknown): value is HTMLElement {
	return typeof HTMLElement !== 'undefined' && value instanceof HTMLElement;
}

function isShadowRoot(value: unknown): value is ShadowRoot {
	return typeof ShadowRoot !== 'undefined' && value instanceof ShadowRoot;
}

/** The event's original target, looking into shadow roots. */
export function getTarget(event: Event): EventTarget | null {
	return typeof event.composedPath === 'function' ? (event.composedPath()[0] ?? event.target) : event.target;
}

/** `Node.contains` that also crosses shadow root boundaries. */
export function contains(parent: Element | null | undefined, child: Element | null | undefined): boolean {
	if (!parent || !child) return false;
	if (parent.contains(child)) return true;

	const rootNode = child.getRootNode?.();
	if (!isShadowRoot(rootNode)) return false;

	let next: Node | null = child;
	while (next) {
		if (parent === next) return true;
		next = next.parentNode ?? (isShadowRoot(next) ? next.host : null);
	}
	return false;
}

/** `Element.closest` that continues the search past shadow root hosts. */
export function closest(element: Element | null | undefined, selector: string): Element | null {
	let current: Element | null | undefined = element;
	while (current) {
		const match = current.closest(selector);
		if (match) return match;
		const root = current.getRootNode();
		current = isShadowRoot(root) ? root.host : null;
	}
	return null;
}

/** The focused element, looking into shadow roots. */
export function activeElement(doc: Document): Element | null {
	let element = doc.activeElement;
	while (element?.shadowRoot?.activeElement) {
		element = element.shadowRoot.activeElement;
	}
	return element;
}

/**
 * `elementFromPoint` on the given root. Callers pass `getRootNode()` (a document or a shadow root):
 * `Document.elementFromPoint` retargets shadow content to its host, which then fails `contains()`.
 */
export function getElementAtPoint(root: Node | null | undefined, x: number, y: number): Element | null {
	const fromPoint = (root as Partial<Pick<Document, 'elementFromPoint'>> | null | undefined)?.elementFromPoint;
	return typeof fromPoint === 'function' ? fromPoint.call(root, x, y) : null;
}

/**
 * Extracts the 2D translation and scale from the element's computed `transform` matrix.
 * The `translate`, `rotate` and `scale` longhands are not reflected in it.
 */
export function getElementTransform(element: HTMLElement, computedStyle?: CSSStyleDeclaration) {
	const transform = (computedStyle ?? getComputedStyle(element)).transform;
	let x = 0;
	let y = 0;
	let scale = 1;

	if (transform && transform !== 'none') {
		const matrix = transform.match(/matrix(?:3d)?\(([^)]+)\)/);
		if (matrix) {
			const values = matrix[1].split(', ').map(parseFloat);
			if (values.length === 6) {
				x = values[4];
				y = values[5];
				scale = Math.sqrt(values[0] * values[0] + values[1] * values[1]);
			} else if (values.length === 16) {
				x = values[12];
				y = values[13];
				scale = values[0];
			}
		}
	}

	return { x, y, scale };
}

export function getParentNode(node: Node): Node {
	if (node.nodeName.toLowerCase() === 'html') return node;
	return (
		(node as Element).assignedSlot ??
		node.parentNode ??
		(isShadowRoot(node) ? node.host : null) ??
		(node.ownerDocument ?? document).documentElement
	);
}

function isLastTraversableNode(node: Node): boolean {
	return ['html', 'body', '#document'].includes(node.nodeName.toLowerCase());
}

export function isScrollable(element: HTMLElement, axis: ScrollAxis, allowOverflowIntent = false): boolean {
	const style = getComputedStyle(element);
	const overflow = axis === 'vertical' ? style.overflowY : style.overflowX;
	if (overflow !== 'auto' && overflow !== 'scroll') return false;

	// With `allowOverflowIntent`, a container that only overflows once extra space is added (e.g. the
	// drawer keyboard scroll slack) still counts, as long as it has layout size on the axis.
	if (axis === 'vertical') {
		return allowOverflowIntent ? element.clientHeight > 0 : element.scrollHeight > element.clientHeight;
	}
	return allowOverflowIntent ? element.clientWidth > 0 : element.scrollWidth > element.clientWidth;
}

export function findScrollableAncestor(
	target: EventTarget | null,
	root: HTMLElement,
	axis: ScrollAxis,
	allowOverflowIntent = false,
): HTMLElement | null {
	// `getParentNode` crosses shadow boundaries (and slots). Non-HTML targets (SVG, MathML) can't
	// scroll, but their HTML ancestors can.
	let node: unknown = target;
	while (isElement(node) && node !== root && !isLastTraversableNode(node)) {
		if (isHTMLElement(node) && isScrollable(node, axis, allowOverflowIntent)) return node;
		node = getParentNode(node);
	}
	return null;
}

export function findScrollableTouchTarget(
	target: EventTarget | null,
	root: HTMLElement,
	axis: ScrollAxis = 'vertical',
	allowOverflowIntent = false,
): HTMLElement | null {
	return (
		findScrollableAncestor(target, root, axis, allowOverflowIntent) ??
		(isScrollable(root, axis, allowOverflowIntent) ? root : null)
	);
}
