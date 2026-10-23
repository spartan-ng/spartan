export interface ParsedAttribute {
	name: string;
	raw: string;
	value: string | null;
}

export interface OpeningTag {
	start: number;
	end: number;
	attrs: string;
	selfClosing: boolean;
}

export interface InputOtpElement {
	start: number;
	end: number;
	openTagEnd: number;
	closeTagStart: number | null;
	attrs: string;
	inner: string;
	selfClosing: boolean;
}

const INPUT_OTP_TAG = 'brn-input-otp';
const INPUT_OTP_CLOSE_TAG = `</${INPUT_OTP_TAG}>`;

export function findInputOtpElements(content: string): InputOtpElement[] {
	const elements: InputOtpElement[] = [];
	let index = 0;

	while (index < content.length) {
		const openStart = content.indexOf(`<${INPUT_OTP_TAG}`, index);

		if (openStart === -1) {
			break;
		}

		const nameEnd = openStart + INPUT_OTP_TAG.length + 1;
		const nextChar = content[nameEnd];

		if (nextChar && /[\w-]/.test(nextChar)) {
			index = nameEnd;
			continue;
		}

		const openTagEnd = findTagEnd(content, nameEnd);

		if (openTagEnd === -1) {
			break;
		}

		const rawAttrs = content.slice(nameEnd, openTagEnd - 1);
		const selfClosing = /\/\s*$/.test(rawAttrs);
		const attrs = selfClosing ? rawAttrs.replace(/\/\s*$/, '') : rawAttrs;

		if (selfClosing) {
			elements.push({
				start: openStart,
				end: openTagEnd,
				openTagEnd,
				closeTagStart: null,
				attrs,
				inner: '',
				selfClosing: true,
			});
			index = openTagEnd;
			continue;
		}

		const closeTagStart = content.indexOf(INPUT_OTP_CLOSE_TAG, openTagEnd);

		if (closeTagStart === -1) {
			index = openTagEnd;
			continue;
		}

		const closeTagEnd = closeTagStart + INPUT_OTP_CLOSE_TAG.length;

		elements.push({
			start: openStart,
			end: closeTagEnd,
			openTagEnd,
			closeTagStart,
			attrs,
			inner: content.slice(openTagEnd, closeTagStart),
			selfClosing: false,
		});

		index = closeTagEnd;
	}

	return elements;
}

export function findOpeningTags(content: string, tagName: string): OpeningTag[] {
	const tags: OpeningTag[] = [];
	const prefix = `<${tagName}`;
	let index = 0;

	while (index < content.length) {
		const tagStart = content.indexOf(prefix, index);

		if (tagStart === -1) {
			break;
		}

		const nameEnd = tagStart + prefix.length;
		const nextChar = content[nameEnd];

		if (nextChar && /[\w-]/.test(nextChar)) {
			index = nameEnd;
			continue;
		}

		const tagEnd = findTagEnd(content, nameEnd);

		if (tagEnd === -1) {
			break;
		}

		const rawAttrs = content.slice(nameEnd, tagEnd - 1);
		const selfClosing = /\/\s*$/.test(rawAttrs);

		tags.push({
			start: tagStart,
			end: tagEnd,
			attrs: selfClosing ? rawAttrs.replace(/\/\s*$/, '') : rawAttrs,
			selfClosing,
		});

		index = tagEnd;
	}

	return tags;
}

export function parseAttributes(attrs: string): ParsedAttribute[] {
	const attributes: ParsedAttribute[] = [];
	let index = 0;

	while (index < attrs.length) {
		while (index < attrs.length && /\s/.test(attrs[index])) {
			index++;
		}

		if (index >= attrs.length) {
			break;
		}

		const start = index;

		while (index < attrs.length && !/[\s=]/.test(attrs[index])) {
			index++;
		}

		const name = attrs.slice(start, index);

		if (!name) {
			break;
		}

		while (index < attrs.length && /\s/.test(attrs[index])) {
			index++;
		}

		let value: string | null = null;

		if (attrs[index] === '=') {
			index++;

			while (index < attrs.length && /\s/.test(attrs[index])) {
				index++;
			}

			if (attrs[index] === '"' || attrs[index] === "'") {
				const quote = attrs[index];
				index++;
				const valueStart = index;

				while (index < attrs.length && attrs[index] !== quote) {
					index++;
				}

				value = attrs.slice(valueStart, index);

				if (attrs[index] === quote) {
					index++;
				}
			} else {
				const valueStart = index;

				while (index < attrs.length && !/\s/.test(attrs[index])) {
					index++;
				}

				value = attrs.slice(valueStart, index);
			}
		}

		attributes.push({
			name,
			raw: attrs.slice(start, index),
			value,
		});
	}

	return attributes;
}

export function attributeName(attribute: ParsedAttribute): string {
	return attribute.name.replace(/^\[\(?/, '').replace(/\)?\]$/, '');
}

export function serializeAttributes(attributes: ParsedAttribute[]): string {
	return attributes.length ? ` ${attributes.map((attribute) => attribute.raw).join(' ')}` : '';
}

export function isHelmAttribute(attribute: ParsedAttribute): boolean {
	const name = attributeName(attribute);
	return name === 'hlmInputOtp' || name === 'hlm';
}

export function hasHelmAttribute(attributes: ParsedAttribute[]): boolean {
	return attributes.some(isHelmAttribute);
}

export function hasContainerStyles(attributes: ParsedAttribute[]): boolean {
	return attributes.some((attribute) => attributeName(attribute) === 'containerStyles');
}

const INPUT_ATTRIBUTE_RENAMES: Record<string, string> = {
	inputClass: 'class',
	inputAutocomplete: 'autocomplete',
};

export function splitInputAttributes(attributes: ParsedAttribute[]): {
	rootAttrs: ParsedAttribute[];
	inputAttrs: ParsedAttribute[];
} {
	const rootAttrs: ParsedAttribute[] = [];
	const inputAttrs: ParsedAttribute[] = [];

	for (const attribute of attributes) {
		const name = attributeName(attribute);
		const renamed = INPUT_ATTRIBUTE_RENAMES[name];

		if (renamed) {
			inputAttrs.push(renameAttribute(attribute, name, renamed));
			continue;
		}

		if (name === 'inputStyles' || name === 'inputMode') {
			inputAttrs.push(attribute);
			continue;
		}

		rootAttrs.push(attribute);
	}

	return { rootAttrs, inputAttrs };
}

export function renameAttribute(attribute: ParsedAttribute, from: string, to: string): ParsedAttribute {
	const name = attribute.name.replace(from, to);
	return {
		...attribute,
		name,
		raw: attribute.raw.replace(attribute.name, name),
	};
}

export function addAttributesToExistingInput(content: string, inputAttrs: ParsedAttribute[]): string {
	if (inputAttrs.length === 0) {
		return content;
	}

	for (const tag of findOpeningTags(content, 'input')) {
		const attrs = parseAttributes(tag.attrs);

		if (!attrs.some((attribute) => attributeName(attribute) === 'brnInputOtpInput')) {
			continue;
		}

		const merged = mergeAttributes(attrs, inputAttrs);
		const replacement = `<input${serializeAttributes(merged)} />`;

		return content.slice(0, tag.start) + replacement + content.slice(tag.end);
	}

	return content;
}

export function hasInputOtpInputDirective(content: string): boolean {
	return findOpeningTags(content, 'input').some((tag) =>
		parseAttributes(tag.attrs).some((attribute) => attributeName(attribute) === 'brnInputOtpInput'),
	);
}

function mergeAttributes(existing: ParsedAttribute[], added: ParsedAttribute[]): ParsedAttribute[] {
	const merged = [...existing];

	const isClassBindingPair = (current: ParsedAttribute, incoming: ParsedAttribute) =>
		(current.name === 'class' && incoming.name === '[class]') ||
		(current.name === '[class]' && incoming.name === 'class');

	for (const attribute of added) {
		const name = attributeName(attribute);
		const index = merged.findIndex(
			(current) => attributeName(current) === name && !isClassBindingPair(current, attribute),
		);

		if (index === -1) {
			merged.push(attribute);
			continue;
		}

		if (name === 'class' && !attribute.name.startsWith('[') && !merged[index].name.startsWith('[')) {
			const values = [merged[index].value, attribute.value]
				.filter((value): value is string => !!value)
				.join(' ')
				.split(/\s+/)
				.filter(Boolean);

			const value = Array.from(new Set(values)).join(' ');
			merged[index] = { name: 'class', raw: `class="${value}"`, value };
			continue;
		}

		merged[index] = attribute;
	}

	return merged;
}

function findTagEnd(content: string, from: number): number {
	let quote: string | null = null;

	for (let index = from; index < content.length; index++) {
		const char = content[index];

		if (quote) {
			if (char === quote) {
				quote = null;
			}
			continue;
		}

		if (char === '"' || char === "'") {
			quote = char;
			continue;
		}

		if (char === '>') {
			return index + 1;
		}
	}

	return -1;
}
