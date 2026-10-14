import { getScrollContainers } from './brn-overlay-scroll-containers';

describe('getScrollContainers', () => {
	let root: HTMLElement;

	beforeEach(() => {
		root = document.createElement('div');
		document.body.appendChild(root);
	});

	afterEach(() => root.remove());

	const element = (parent: Element | ShadowRoot, style = '') => {
		const child = document.createElement('div');
		child.setAttribute('style', style);
		parent.appendChild(child);
		return child;
	};

	it('returns the enclosing scroll containers from the closest outwards', () => {
		const outer = element(root, 'overflow: auto');
		const visible = element(outer);
		const inner = element(visible, 'overflow-y: scroll');
		const anchor = element(inner);

		expect(getScrollContainers(anchor)).toEqual([inner, outer]);
	});

	it('includes hidden overflow, which still scrolls programmatically, and skips clip', () => {
		const hidden = element(root, 'overflow: hidden');
		const clipped = element(hidden, 'overflow: clip');
		const anchor = element(clipped);

		expect(getScrollContainers(anchor)).toEqual([hidden]);
	});

	it('skips elements whose overflow does not apply', () => {
		const contents = element(root, 'display: contents; overflow: auto');
		const anchor = element(contents);

		expect(getScrollContainers(anchor)).not.toContain(contents);
	});

	it('crosses shadow roots and stops before the root element', () => {
		const container = element(root, 'overflow: auto');
		const host = element(container);
		const anchor = element(host.attachShadow({ mode: 'open' }));

		const containers = getScrollContainers(anchor);

		expect(containers).toContain(container);
		expect(containers).not.toContain(document.documentElement);
	});
});
