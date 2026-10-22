import { formatFiles, type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import type { MigrateInputOtpGeneratorSchema } from './schema';

const INPUT_OTP_ELEMENT = /<brn-input-otp(?![\w-])([^>]*)>([\s\S]*?)<\/brn-input-otp>/g;
const SELF_CLOSING_INPUT_OTP = /<brn-input-otp(?![\w-])([^>]*?)\/>/g;
const HELM_ATTRIBUTE = /\b(?:hlmInputOtp|hlm)\b/;

const INPUT_CONFIG_ATTRIBUTES: Array<{ pattern: RegExp; rename?: (attribute: string) => string }> = [
	{
		pattern: /\s+(?:\[)?inputClass(?:\])?=(?:"[^"]*"|'[^']*')/g,
		rename: (attribute) => attribute.replace('inputClass', 'class'),
	},
	{ pattern: /\s+(?:\[)?inputStyles(?:\])?=(?:"[^"]*"|'[^']*')/g },
	{ pattern: /\s+(?:\[)?inputMode(?:\])?=(?:"[^"]*"|'[^']*')/g },
	{
		pattern: /\s+(?:\[)?inputAutocomplete(?:\])?=(?:"[^"]*"|'[^']*')/g,
		rename: (attribute) => attribute.replace('inputAutocomplete', 'autocomplete'),
	},
];

const cleanHelmAttributes = (attrs: string) =>
	attrs
		.replace(/\s*\bhlmInputOtp\b/g, '')
		.replace(/\s*\bhlm\b/g, '')
		.trimEnd();

function extractInputAttributes(attrs: string) {
	const moved: string[] = [];
	let rootAttrs = attrs;

	for (const { pattern, rename } of INPUT_CONFIG_ATTRIBUTES) {
		rootAttrs = rootAttrs.replace(pattern, (match) => {
			const attribute = match.trim();
			moved.push(rename ? rename(attribute) : attribute);
			return '';
		});
	}

	return {
		rootAttrs,
		inputAttrs: moved.length ? ` ${moved.join(' ')}` : '',
	};
}

export async function migrateInputOtpGenerator(tree: Tree, { skipFormat }: MigrateInputOtpGeneratorSchema) {
	migrateMarkup(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function migrateMarkup(tree: Tree) {
	visitNotIgnoredFiles(tree, '.', (path) => {
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content || !content.includes('<brn-input-otp')) {
			return;
		}

		let hasBrainUsage = false;

		content = content.replace(SELF_CLOSING_INPUT_OTP, (match, attrs: string) => {
			if (HELM_ATTRIBUTE.test(attrs)) {
				return `<hlm-input-otp${cleanHelmAttributes(attrs)} />`;
			}

			hasBrainUsage = true;

			const { rootAttrs, inputAttrs } = extractInputAttributes(attrs);

			return `<brn-input-otp${rootAttrs}><input brnInputOtpInput${inputAttrs} /></brn-input-otp>`;
		});

		content = content.replace(INPUT_OTP_ELEMENT, (match, attrs: string, inner: string) => {
			if (HELM_ATTRIBUTE.test(attrs)) {
				return `<hlm-input-otp${cleanHelmAttributes(attrs)}>${inner}</hlm-input-otp>`;
			}

			hasBrainUsage = true;

			const { rootAttrs, inputAttrs } = extractInputAttributes(attrs);

			if (inner.includes('brnInputOtpInput')) {
				const updatedInner = inputAttrs
					? inner.replace(/<input\b([^>]*brnInputOtpInput[^>]*)\/>/, `<input$1${inputAttrs} />`)
					: inner;

				return `<brn-input-otp${rootAttrs}>${updatedInner}</brn-input-otp>`;
			}

			return `<brn-input-otp${rootAttrs}>${inner}<input brnInputOtpInput${inputAttrs} /></brn-input-otp>`;
		});

		if (hasBrainUsage) {
			content = ensureInputImport(content);
		}

		tree.write(path, content);
	});
}

function ensureInputImport(content: string) {
	if (content.includes('BrnInputOtpImports')) {
		return content;
	}

	let updated = content.replace(
		/import\s*\{([^}]*)\}\s*from\s*['"]@spartan-ng\/brain\/input-otp['"];/,
		(statement, specifiers: string) => {
			const trimmed = specifiers.trim();

			if (!trimmed.includes('BrnInputOtp') || trimmed.includes('BrnInputOtpInput')) {
				return statement;
			}

			return `import { ${trimmed}, BrnInputOtpInput } from '@spartan-ng/brain/input-otp';`;
		},
	);

	updated = updated.replace(/(imports\s*:\s*\[)([^\]]*)(\])/g, (match, start: string, body: string, end: string) => {
		if (!/\bBrnInputOtp\b/.test(body) || /\bBrnInputOtpInput\b/.test(body)) {
			return match;
		}

		const trimmed = body.trimEnd();
		const separator = trimmed.endsWith(',') ? ' ' : ', ';

		return `${start}${trimmed}${separator}BrnInputOtpInput${end}`;
	});

	return updated;
}

export default migrateInputOtpGenerator;
