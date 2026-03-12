import { twMerge } from 'tailwind-merge';
import {
	type ArrayLiteralExpression,
	type CallExpression,
	Node,
	type NoSubstitutionTemplateLiteral,
	type SourceFile,
	type StringLiteral,
} from 'ts-morph';

import { type StyleMap } from './create-style-map';
import type { TransformerStyle } from './transform';

const ALLOWLIST = new Set(['spartan-menu-target', 'spartan-logical-sides', 'spartan-rtl-flip']);

function isStringLiteralLike(node: Node): node is StringLiteral | NoSubstitutionTemplateLiteral {
	return Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node);
}

export const transformStyleMap: TransformerStyle<SourceFile> = async ({ sourceFile, styleMap }) => {
	const matchedClasses = new Set<string>();
	applyToHlmCalls(sourceFile, styleMap, matchedClasses);
	applyToClassesCalls(sourceFile, styleMap, matchedClasses);
	applyToHtmlInStrings(sourceFile, styleMap, matchedClasses);
	applyToRawHtml(sourceFile, styleMap, matchedClasses);
	applyToCvaCalls(sourceFile, styleMap, matchedClasses);

	return sourceFile;
};

function applyToRawHtml(sourceFile: SourceFile, styleMap: StyleMap, matchedClasses: Set<string>) {
	const text = sourceFile.getFullText();

	if (!text.includes('class="')) return;

	const updated = text.replace(/class="([^"]+)"/g, (_, classValue: string) => {
		const classes = extractSpartanClasses(classValue);
		if (classes.length === 0) return `class="${classValue}"`;

		const unmatched = classes.filter((c) => !matchedClasses.has(c));

		const tailwindClasses = unmatched.map((c) => styleMap[c]).filter((v): v is string => Boolean(v));

		let updatedClass = classValue;

		if (tailwindClasses.length) {
			updatedClass = mergeClasses(tailwindClasses.join(' '), classValue);
			unmatched.forEach((c) => matchedClasses.add(c));
		}

		updatedClass = removeSpartanClasses(updatedClass);

		return `class="${updatedClass}"`;
	});

	if (updated !== text) {
		sourceFile.replaceWithText(updated);
	}
}

function applyToHtmlInStrings(sourceFile: SourceFile, styleMap: StyleMap, matchedClasses: Set<string>) {
	sourceFile.forEachDescendant((node) => {
		if (!isStringLiteralLike(node)) return;

		const text = node.getLiteralText();

		if (!text.includes('class="')) return;

		const updated = text.replace(/class="([^"]+)"/g, (_, classValue: string) => {
			const classes = extractSpartanClasses(classValue);
			if (classes.length === 0) return `class="${classValue}"`;

			const unmatched = classes.filter((c) => !matchedClasses.has(c));

			const tailwindClasses = unmatched.map((c) => styleMap[c]).filter((v): v is string => Boolean(v));

			let updatedClass = classValue;

			if (tailwindClasses.length) {
				updatedClass = mergeClasses(tailwindClasses.join(' '), classValue);
				unmatched.forEach((c) => matchedClasses.add(c));
			}

			updatedClass = removeSpartanClasses(updatedClass);

			return `class="${updatedClass}"`;
		});

		if (updated !== text) {
			node.setLiteralValue(updated);
		}
	});
}

function applyToClassesCalls(sourceFile: SourceFile, styleMap: StyleMap, matchedClasses: Set<string>) {
	sourceFile.forEachDescendant((node) => {
		if (!Node.isCallExpression(node)) return;

		const expression = node.getExpression();
		if (!Node.isIdentifier(expression) || expression.getText() !== 'classes') return;

		const firstArg = node.getArguments()[0];
		if (!firstArg || !Node.isArrowFunction(firstArg)) return;

		const body = firstArg.getBody();

		if (isStringLiteralLike(body)) {
			applyStyle(body, styleMap, matchedClasses);
			return;
		}

		if (Node.isArrayLiteralExpression(body)) {
			applyToArrayLiteral(body, styleMap, matchedClasses);
		}
	});
}

function applyToArrayLiteral(arrayNode: ArrayLiteralExpression, styleMap: StyleMap, matchedClasses: Set<string>) {
	for (const element of arrayNode.getElements()) {
		if (isStringLiteralLike(element)) {
			applyStyle(element, styleMap, matchedClasses);
			continue;
		}

		element.forEachDescendant((node) => {
			if (isStringLiteralLike(node)) {
				applyStyle(node, styleMap, matchedClasses);
			}
		});
	}
}

function applyToHlmCalls(sourceFile: SourceFile, styleMap: StyleMap, matchedClasses: Set<string>) {
	sourceFile.forEachDescendant((node) => {
		if (!Node.isCallExpression(node)) return;

		const expression = node.getExpression();
		if (!Node.isIdentifier(expression) || expression.getText() !== 'hlm') return;

		for (const arg of node.getArguments()) {
			if (!isStringLiteralLike(arg)) continue;
			applyStyle(arg, styleMap, matchedClasses);
		}

		removeEmptyArgumentsFromHlm(node);
	});
}

function applyStyle(
	stringNode: StringLiteral | NoSubstitutionTemplateLiteral,
	styleMap: StyleMap,
	matchedClasses: Set<string>,
) {
	const value = stringNode.getLiteralText();
	const classes = extractSpartanClasses(value);

	if (!classes.length) return;

	const unmatched = classes.filter((c) => !matchedClasses.has(c));

	const tailwind = unmatched.map((c) => styleMap[c]).filter((v): v is string => Boolean(v));

	let updated = value;

	if (tailwind.length) {
		updated = mergeClasses(tailwind.join(' '), value);
		unmatched.forEach((c) => matchedClasses.add(c));
	}

	updated = removeSpartanClasses(updated);

	stringNode.setLiteralValue(updated);
}

function extractSpartanClasses(str: string) {
	const matches = str.matchAll(/\bspartan-[\w-]+\b/g);
	return Array.from(matches, (m) => m[0]);
}

function removeSpartanClasses(str: string) {
	return str
		.replace(/\bspartan-[\w-]+\b/g, (match) => {
			if (ALLOWLIST.has(match)) return match;
			return '';
		})
		.replace(/\s+/g, ' ')
		.trim();
}

function removeEmptyArgumentsFromHlm(call: CallExpression) {
	const args = call.getArguments();

	const filtered = args.filter((arg) => {
		if (isStringLiteralLike(arg)) {
			return arg.getLiteralText().trim() !== '';
		}
		return true;
	});

	if (filtered.length !== args.length) {
		const argTexts = filtered.map((a) => a.getText());
		call.replaceWithText(`hlm(${argTexts.join(', ')})`);
	}
}

function mergeClasses(newClasses: string, existing: string) {
	return twMerge(newClasses, existing);
}

function applyToCvaCalls(sourceFile: SourceFile, styleMap: StyleMap, matchedClasses: Set<string>) {
	sourceFile.forEachDescendant((node) => {
		if (!Node.isCallExpression(node)) {
			return;
		}

		const expression = node.getExpression();
		if (!Node.isIdentifier(expression) || expression.getText() !== 'cva') {
			return;
		}

		const baseArg = node.getArguments()[0];
		if (Node.isStringLiteral(baseArg)) {
			applyStyleToCvaString(baseArg, styleMap, matchedClasses);
		}

		const configArg = node.getArguments()[1];
		if (!configArg || !Node.isObjectLiteralExpression(configArg)) {
			return;
		}

		const variantsProp = configArg
			.getProperties()
			.find(
				(prop) =>
					Node.isPropertyAssignment(prop) &&
					Node.isIdentifier(prop.getNameNode()) &&
					prop.getNameNode().getText() === 'variants',
			);

		if (!variantsProp || !Node.isPropertyAssignment(variantsProp)) {
			return;
		}

		const variantsObj = variantsProp.getInitializer();
		if (!variantsObj || !Node.isObjectLiteralExpression(variantsObj)) {
			return;
		}

		variantsObj.getProperties().forEach((typeProp) => {
			if (!Node.isPropertyAssignment(typeProp)) {
				return;
			}

			const typeObj = typeProp.getInitializer();
			if (!typeObj || !Node.isObjectLiteralExpression(typeObj)) {
				return;
			}

			typeObj.getProperties().forEach((variantProp) => {
				if (!Node.isPropertyAssignment(variantProp)) {
					return;
				}

				const variantValue = variantProp.getInitializer();
				if (variantValue && Node.isStringLiteral(variantValue)) {
					applyStyleToCvaString(variantValue, styleMap, matchedClasses);
				}
			});
		});
	});
}
function applyStyleToCvaString(stringNode: StringLiteral, styleMap: StyleMap, matchedClasses: Set<string>) {
	const stringValue = stringNode.getLiteralText();
	const hlmClasses = extractCnClasses(stringValue);

	if (hlmClasses.length === 0) {
		return;
	}

	// Process all spartan-* classes, not just the first one
	const unmatchedClasses = hlmClasses.filter((hlmClass) => !matchedClasses.has(hlmClass));

	if (unmatchedClasses.length === 0) {
		// All classes already matched, just clean up non-allowlisted ones
		const updated = removeCnClasses(stringValue);
		stringNode.setLiteralValue(updated);
		return;
	}

	const tailwindClassesToApply = unmatchedClasses
		.map((hlmClass) => styleMap[hlmClass])
		.filter((classes): classes is string => Boolean(classes));

	if (tailwindClassesToApply.length > 0) {
		const mergedClasses = tailwindClassesToApply.join(' ');
		const updated = removeCnClasses(mergeClasses(mergedClasses, stringValue));
		stringNode.setLiteralValue(updated);
		unmatchedClasses.forEach((hlmClass) => matchedClasses.add(hlmClass));
	} else {
		// No styles to apply, but still need to clean up non-allowlisted classes
		const updated = removeCnClasses(stringValue);
		stringNode.setLiteralValue(updated);
	}
}

function extractCnClasses(str: string) {
	const matches = str.matchAll(/\bspartan-[\w-]+\b/g);
	return Array.from(matches, (match) => match[0]);
}

function removeCnClasses(str: string) {
	return str
		.replace(/\bspartan-[\w-]+\b/g, (match) => {
			// Preserve allowlisted classes
			if (ALLOWLIST.has(match)) {
				return match;
			}
			return '';
		})
		.replace(/\s+/g, ' ')
		.trim();
}
