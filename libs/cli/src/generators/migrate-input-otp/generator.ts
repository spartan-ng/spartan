import { formatFiles, logger, type Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { dirname, join } from 'node:path';
import type { MigrateInputOtpGeneratorSchema } from './schema';
import {
	addAttributesToExistingInput,
	findInputOtpElements,
	hasContainerStyles,
	hasHelmAttribute,
	hasInputOtpInputDirective,
	isHelmAttribute,
	parseAttributes,
	serializeAttributes,
	splitInputAttributes,
} from './utils';

const INPUT_OTP_MODULE = '@spartan-ng/brain/input-otp';

export async function migrateInputOtpGenerator(tree: Tree, { skipFormat }: MigrateInputOtpGeneratorSchema) {
	migrateMarkup(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function migrateMarkup(tree: Tree) {
	const files = collectFiles(tree);
	const templateOwners = mapTemplateOwners(files);
	const updatedContents = new Map(files);
	const componentsToUpdate = new Set<string>();

	for (const [filePath, content] of files) {
		if (!content.includes('<brn-input-otp')) {
			continue;
		}

		const migrated = migrateInputOtpElements(content);

		if (migrated.content !== content) {
			updatedContents.set(filePath, migrated.content);
		}

		if (!migrated.hasBrainUsage) {
			continue;
		}

		const owner = filePath.endsWith('.html') ? templateOwners.get(normalizePath(filePath)) : filePath;

		if (owner) {
			componentsToUpdate.add(owner);
		} else {
			logger.warn(`Could not find the component that owns ${filePath}. Add BrnInputOtpInput to its imports manually.`);
		}
	}

	for (const componentPath of componentsToUpdate) {
		const content = updatedContents.get(componentPath) ?? tree.read(componentPath, 'utf-8');

		if (!content) {
			continue;
		}

		const updated = ensureInputImport(content);

		if (updated !== content) {
			updatedContents.set(componentPath, updated);
		}
	}

	for (const [filePath, content] of updatedContents) {
		if (content !== files.get(filePath)) {
			tree.write(filePath, content);
		}
	}
}

function migrateInputOtpElements(content: string): { content: string; hasBrainUsage: boolean } {
	const replacements: Array<{ start: number; end: number; text: string }> = [];
	let hasBrainUsage = false;

	for (const element of findInputOtpElements(content)) {
		const attrs = parseAttributes(element.attrs);

		// The old container wrapper was removed. Leave the element untouched and let the
		// healthcheck explain how to move custom container styles.
		if (hasContainerStyles(attrs)) {
			continue;
		}

		if (hasHelmAttribute(attrs)) {
			const remaining = attrs.filter((attribute) => !isHelmAttribute(attribute));
			const attrsText = serializeAttributes(remaining);
			const text = element.selfClosing
				? `<hlm-input-otp${attrsText} />`
				: `<hlm-input-otp${attrsText}>${element.inner}</hlm-input-otp>`;

			replacements.push({ start: element.start, end: element.end, text });
			continue;
		}

		hasBrainUsage = true;

		const { rootAttrs, inputAttrs } = splitInputAttributes(attrs);
		const rootAttrsText = serializeAttributes(rootAttrs);
		const inputAttrsText = serializeAttributes(inputAttrs);

		if (element.selfClosing) {
			replacements.push({
				start: element.start,
				end: element.end,
				text: `<brn-input-otp${rootAttrsText}><input brnInputOtpInput${inputAttrsText} /></brn-input-otp>`,
			});
			continue;
		}

		let inner = element.inner;

		if (hasInputOtpInputDirective(inner)) {
			inner = addAttributesToExistingInput(inner, inputAttrs);
		} else {
			inner += `<input brnInputOtpInput${inputAttrsText} />`;
		}

		replacements.push({
			start: element.start,
			end: element.end,
			text: `<brn-input-otp${rootAttrsText}>${inner}</brn-input-otp>`,
		});
	}

	let migrated = content;

	for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
		migrated = migrated.slice(0, replacement.start) + replacement.text + migrated.slice(replacement.end);
	}

	return { content: migrated, hasBrainUsage };
}

function collectFiles(tree: Tree): Map<string, string> {
	const files = new Map<string, string>();

	visitNotIgnoredFiles(tree, '.', (filePath) => {
		if (!filePath.endsWith('.ts') && !filePath.endsWith('.html')) {
			return;
		}

		const content = tree.read(filePath, 'utf-8');

		if (!content) {
			return;
		}

		if (filePath.endsWith('.ts') || content.includes('<brn-input-otp')) {
			files.set(filePath, content);
		}
	});

	return files;
}

function mapTemplateOwners(files: Map<string, string>): Map<string, string> {
	const owners = new Map<string, string>();

	for (const [filePath, content] of files) {
		if (!filePath.endsWith('.ts')) {
			continue;
		}

		const templateUrl = /templateUrl\s*:\s*['"]([^'"]+)['"]/g;
		let match: RegExpExecArray | null;

		while ((match = templateUrl.exec(content))) {
			const templatePath = normalizePath(join(dirname(filePath), match[1]));
			owners.set(templatePath, filePath);
		}
	}

	return owners;
}

function ensureInputImport(content: string): string {
	const initialSpecifiers = getImportSpecifiers(content);
	const importsTokenNames = initialSpecifiers
		.filter((specifier) => specifier.original === 'BrnInputOtpImports')
		.map((specifier) => specifier.local);

	if (importsTokenNames.some((name) => hasImportsToken(content, name))) {
		return content;
	}

	let updated = ensureNamedImport(content, 'BrnInputOtpInput');

	const specifiers = getImportSpecifiers(updated);
	const inputLocal = specifiers.find((specifier) => specifier.original === 'BrnInputOtpInput')?.local;

	if (!inputLocal) {
		return updated;
	}

	const namespace = getNamespaceAlias(updated);
	const relevantNames = specifiers
		.filter((specifier) => ['BrnInputOtp', 'BrnInputOtpSlot', 'BrnInputOtpImports'].includes(specifier.original))
		.map((specifier) => specifier.local);

	updated = updated.replace(/(imports\s*:\s*\[)([^\]]*)(\])/g, (match, start: string, body: string, end: string) => {
		if (new RegExp(`\\b${escapeRegExp(inputLocal)}\\b`).test(body)) {
			return match;
		}

		if (/\bBrnInputOtpImports\b/.test(body)) {
			return match;
		}

		const isRelevant =
			relevantNames.some((name) => new RegExp(`\\b${escapeRegExp(name)}\\b`).test(body)) ||
			(namespace !== null && body.includes(`${namespace}.`));

		if (!isRelevant) {
			return match;
		}

		const trimmed = body.trimEnd();
		const separator = trimmed.endsWith(',') ? ' ' : ', ';

		return `${start}${trimmed}${separator}${inputLocal ?? 'BrnInputOtpInput'}${end}`;
	});

	return updated;
}

function hasImportsToken(content: string, token: string): boolean {
	let found = false;

	content.replace(/(imports\s*:\s*\[)([^\]]*)(\])/g, (match, _start: string, body: string) => {
		if (new RegExp(`\\b${escapeRegExp(token)}\\b`).test(body)) {
			found = true;
		}

		return match;
	});

	return found;
}

function ensureNamedImport(content: string, name: string): string {
	const namedImport = /import\s*\{([^}]*)\}\s*from\s*['"]@spartan-ng\/brain\/input-otp['"];/;
	const match = content.match(namedImport);

	if (match) {
		const specifiers = match[1].trim();
		const alreadyImported = specifiers.split(',').some((specifier) => {
			const trimmed = specifier.trim();

			if (!trimmed || trimmed.startsWith('type ')) {
				return false;
			}

			return trimmed.split(/\s+as\s+/)[0].trim() === name;
		});

		if (alreadyImported) {
			return content;
		}

		const separator = specifiers.length === 0 ? '' : specifiers.endsWith(',') ? ' ' : ', ';

		return content.replace(namedImport, `import { ${specifiers}${separator}${name} } from '${INPUT_OTP_MODULE}';`);
	}

	if (content.includes(`'${INPUT_OTP_MODULE}'`) || content.includes(`"${INPUT_OTP_MODULE}"`)) {
		return content.replace(
			/(import[^;]*from\s*['"]@spartan-ng\/brain\/input-otp['"];)/,
			`$1\nimport { ${name} } from '${INPUT_OTP_MODULE}';`,
		);
	}

	const firstImport = content.match(/import[^;]*;\s*/);

	if (firstImport) {
		return content.replace(firstImport[0], `${firstImport[0]}import { ${name} } from '${INPUT_OTP_MODULE}';\n`);
	}

	return content;
}

function getImportSpecifiers(content: string): Array<{ original: string; local: string }> {
	const match = content.match(/import\s*\{([^}]*)\}\s*from\s*['"]@spartan-ng\/brain\/input-otp['"];/);

	if (!match) {
		return [];
	}

	return match[1]
		.split(',')
		.map((specifier) => specifier.trim())
		.filter((specifier) => specifier.length > 0 && !specifier.startsWith('type '))
		.map((specifier) => {
			const [original, local] = specifier.split(/\s+as\s+/);
			return {
				original: original.trim(),
				local: (local ?? original).trim(),
			};
		});
}

function getNamespaceAlias(content: string): string | null {
	const match = content.match(/import\s+\*\s+as\s+(\w+)\s+from\s*['"]@spartan-ng\/brain\/input-otp['"];/);
	return match?.[1] ?? null;
}

function normalizePath(filePath: string): string {
	return filePath.replace(/\\/g, '/');
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default migrateInputOtpGenerator;
