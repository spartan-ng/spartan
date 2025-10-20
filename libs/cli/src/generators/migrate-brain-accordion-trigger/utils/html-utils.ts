import parse, { NodeType, type HTMLElement as ParsedHTMLElement } from 'node-html-parser';
export type HTMLElement = ParsedHTMLElement;

export const HTML_PARSE_CONFIG = {
	lowerCaseTagName: false,
	comment: false,
	voidTag: {
		tags: [
			'img',
			'br',
			'hr',
			'area',
			'base',
			'col',
			'embed',
			'input',
			'link',
			'meta',
			'param',
			'source',
			'track',
			'wbr',
		],
	},
};

export function parseHtmlForAccordionMigration(content: string) {
	return parse(content, HTML_PARSE_CONFIG);
}

export function findAccordionButtons(root: HTMLElement): HTMLElement[] {
	return root.querySelectorAll('button[brnAccordionTrigger], button[hlmAccordionTrigger]');
}

export function isInHeading(button: HTMLElement): boolean {
	const parent = button.parentNode;
	return !!(parent && /^h[1-6]$/i.test(parent.tagName));
}

export function hasSignificantSiblings(button: HTMLElement): boolean {
	const parent = button.parentNode as HTMLElement;
	if (!parent) return false;

	const siblings = parent.childNodes.filter((child) => {
		if (child === button) return false;
		if (child.nodeType === NodeType.TEXT_NODE) {
			return child.text?.trim().length > 0;
		}
		return true;
	});

	return siblings.length > 0;
}

export function getButtonText(button: HTMLElement, maxLength = 50): string {
	return button.innerText?.trim()?.substring(0, maxLength) || '';
}

export function wrapButtonInHeading(button: HTMLElement, useContentsClass = true): void {
	const h3Html = useContentsClass ? '<h3 class="contents"></h3>' : '<h3></h3>';
	const h3 = parseHtmlForAccordionMigration(h3Html).firstChild as HTMLElement;

	const parent = button.parentNode as HTMLElement;
	button.remove();
	h3.appendChild(button);

	if (parent) {
		parent.prepend(h3);
	}
}
