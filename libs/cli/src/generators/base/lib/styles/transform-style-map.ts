import { twMerge } from 'tailwind-merge';
import {
	Node,
	type ArrayLiteralExpression,
	type CallExpression,
	type NoSubstitutionTemplateLiteral,
	type SourceFile,
	type StringLiteral,
} from 'ts-morph';

import { type StyleMap } from './create-style-map';
import type { TransformerStyle } from './transform';

/**
 * Classes that should never be removed during transformation.
 * These are typically used as CSS selectors or for other purposes
 * that require the class name to remain in the code.
 */
// TODO: all spartan-* classes to be allowedlisted.
const ALLOWLIST = new Set(['spartan-menu-target', 'spartan-logical-sides', 'spartan-rtl-flip']);

function isStringLiteralLike(node: Node): node is StringLiteral | NoSubstitutionTemplateLiteral {
	return Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node);
}

export const transformStyleMap: TransformerStyle<SourceFile> = async ({ sourceFile, styleMap }) => {
	const matchedClasses = new Set<string>();

	applyToCvaCalls(sourceFile, styleMap, matchedClasses);
	// applyToClassNameAttributes(sourceFile, styleMap, matchedClasses);
	applyToMergePropsCalls(sourceFile, styleMap, matchedClasses);
	applyToClassesCalls(sourceFile, styleMap, matchedClasses);

	return sourceFile;
};

function applyToClassesCalls(sourceFile: SourceFile, styleMap: StyleMap, matchedClasses: Set<string>) {
	sourceFile.forEachDescendant((node) => {
		if (!Node.isCallExpression(node)) return;

		const expression = node.getExpression();
		if (!Node.isIdentifier(expression) || expression.getText() !== 'classes') return;

		const firstArg = node.getArguments()[0];
		if (!firstArg || !Node.isArrowFunction(firstArg)) return;

		const body = firstArg.getBody();

		// 1️⃣ Handle string literal
		if (isStringLiteralLike(body)) {
			applyStyleToArrowString(body, styleMap, matchedClasses);
			return;
		}

		// 2️⃣ Handle array literal
		if (Node.isArrayLiteralExpression(body)) {
			applyStyleToArrayLiteral(body, styleMap, matchedClasses);
			return;
		}

		// 3️⃣ Handle block body: () => { return ... }
		if (Node.isBlock(body)) {
			const returnStmt = body.getStatements().find(Node.isReturnStatement);
			const returnExpr = returnStmt?.getExpression();
			if (!returnExpr) return;

			if (isStringLiteralLike(returnExpr)) {
				applyStyleToArrowString(returnExpr, styleMap, matchedClasses);
			}

			if (Node.isArrayLiteralExpression(returnExpr)) {
				applyStyleToArrayLiteral(returnExpr, styleMap, matchedClasses);
			}
		}
	});
}

function applyStyleToArrayLiteral(arrayNode: ArrayLiteralExpression, styleMap: StyleMap, matchedClasses: Set<string>) {
	for (const element of arrayNode.getElements()) {
		// Prüfe direkt das Element selbst
		if (isStringLiteralLike(element)) {
			applyStyleToArrowString(element, styleMap, matchedClasses);
			continue;
		}

		// Traverse alle String-Literals innerhalb des Elements (z. B. ternary, function calls)
		element.forEachDescendant((node) => {
			if (!isStringLiteralLike(node)) return;

			const original = node.getLiteralText();
			const cnClasses = extractCnClasses(original);
			if (cnClasses.length === 0) return;

			let updated = original;

			for (const cnClass of cnClasses) {
				if (matchedClasses.has(cnClass)) continue;

				const mapped = styleMap[cnClass];
				if (mapped) {
					updated = mergeClasses(mapped, updated);
				}

				matchedClasses.add(cnClass);
			}

			updated = removeCnClasses(updated);
			node.setLiteralValue(updated.trim());
		});
	}
}

function applyStyleToArrowString(
	stringNode: StringLiteral | NoSubstitutionTemplateLiteral,
	styleMap: StyleMap,
	matchedClasses: Set<string>,
) {
	const stringValue = stringNode.getLiteralText();
	const cnClasses = extractCnClasses(stringValue);

	if (cnClasses.length === 0) return;

	const unmatchedClasses = cnClasses.filter((cnClass) => !matchedClasses.has(cnClass));

	const tailwindClassesToApply = unmatchedClasses
		.map((cnClass) => styleMap[cnClass])
		.filter((classes): classes is string => Boolean(classes));

	let updated = stringValue;

	if (tailwindClassesToApply.length > 0) {
		const mergedClasses = tailwindClassesToApply.join(' ');
		updated = mergeClasses(mergedClasses, stringValue);
		unmatchedClasses.forEach((cnClass) => matchedClasses.add(cnClass));
	}

	updated = removeCnClasses(updated);
	stringNode.setLiteralValue(updated);
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

function applyToClassNameAttributes(sourceFile: SourceFile, styleMap: StyleMap, matchedClasses: Set<string>) {
	sourceFile.forEachDescendant((node) => {
		if (!Node.isJsxAttribute(node) || node.getNameNode().getText() !== 'className') {
			return;
		}

		const initializer = node.getInitializer();
		if (!initializer) {
			return;
		}

		const hlmClasses = extractCnClassesFromAttribute(initializer);

		if (hlmClasses.length === 0) {
			return;
		}

		const jsxElement = node.getParent()?.getParent();
		if (!jsxElement || (!Node.isJsxOpeningElement(jsxElement) && !Node.isJsxSelfClosingElement(jsxElement))) {
			return;
		}

		const unmatchedClasses = hlmClasses.filter((hlmClass) => !matchedClasses.has(hlmClass));

		if (unmatchedClasses.length === 0) {
			// Even if all classes are already matched, we still need to clean them up
			cleanCnClassesFromAttribute(initializer);
			return;
		}

		const tailwindClassesToApply = unmatchedClasses
			.map((hlmClass) => styleMap[hlmClass])
			.filter((classes): classes is string => Boolean(classes));

		if (tailwindClassesToApply.length > 0) {
			const mergedClasses = tailwindClassesToApply.join(' ');
			applyClassesToElement(jsxElement, mergedClasses);
		} else {
			cleanCnClassesFromAttribute(initializer);
		}
	});
}

function extractCnClassesFromAttribute(initializer: Node) {
	const classes: string[] = [];

	if (isStringLiteralLike(initializer)) {
		return extractCnClasses(initializer.getLiteralText());
	}

	if (!Node.isJsxExpression(initializer)) {
		return classes;
	}

	const expression = initializer.getExpression();
	if (!expression) {
		return classes;
	}

	if (isStringLiteralLike(expression)) {
		return extractCnClasses(expression.getLiteralText());
	}

	if (Node.isCallExpression(expression) && isCnCall(expression)) {
		for (const argument of expression.getArguments()) {
			if (isStringLiteralLike(argument)) {
				classes.push(...extractCnClasses(argument.getLiteralText()));
			}
		}
	}

	return classes;
}

function cleanCnClassesFromAttribute(initializer: Node) {
	if (isStringLiteralLike(initializer)) {
		const cleaned = removeCnClasses(initializer.getLiteralText());
		initializer.setLiteralValue(cleaned);
		return;
	}

	if (!Node.isJsxExpression(initializer)) {
		return;
	}

	const expression = initializer.getExpression();
	if (!expression) {
		return;
	}

	if (isStringLiteralLike(expression)) {
		const cleaned = removeCnClasses(expression.getLiteralText());
		expression.setLiteralValue(cleaned);
		return;
	}

	if (Node.isCallExpression(expression) && isCnCall(expression)) {
		for (const argument of expression.getArguments()) {
			if (isStringLiteralLike(argument)) {
				const cleaned = removeCnClasses(argument.getLiteralText());
				argument.setLiteralValue(cleaned);
			}
		}

		removeEmptyArgumentsFromCnCall(expression);
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

function removeEmptyArgumentsFromCnCall(callExpression: CallExpression) {
	if (!isCnCall(callExpression)) {
		return;
	}

	const args = callExpression.getArguments();
	const nonEmptyArgs = args.filter((arg) => {
		if (isStringLiteralLike(arg)) {
			const text = arg.getLiteralText().trim();
			return text !== '';
		}
		return true;
	});

	if (nonEmptyArgs.length !== args.length) {
		const argTexts = nonEmptyArgs.map((arg) => arg.getText());
		const parent = callExpression.getParent();
		if (parent && Node.isJsxExpression(parent)) {
			parent.replaceWithText(`{hlm(${argTexts.join(', ')})}`);
		} else {
			callExpression.replaceWithText(`hlm(${argTexts.join(', ')})`);
		}
	}
}

function applyClassesToElement(element: Node, tailwindClasses: string) {
	if (!Node.isJsxOpeningElement(element) && !Node.isJsxSelfClosingElement(element)) {
		return;
	}

	const attribute = element
		.getAttributes()
		.find((attr) => Node.isJsxAttribute(attr) && attr.getNameNode().getText() === 'className');

	if (!attribute || !Node.isJsxAttribute(attribute)) {
		element.addAttribute({
			name: 'className',
			initializer: `{hlm(${JSON.stringify(tailwindClasses)})}`,
		});
		return;
	}

	const initializer = attribute.getInitializer();

	if (!initializer) {
		attribute.setInitializer(`{hlm(${JSON.stringify(tailwindClasses)})}`);
		return;
	}

	if (isStringLiteralLike(initializer)) {
		const existing = initializer.getLiteralText();
		const updated = removeCnClasses(mergeClasses(tailwindClasses, existing));
		initializer.setLiteralValue(updated);
		return;
	}

	if (!Node.isJsxExpression(initializer)) {
		return;
	}

	const expression = initializer.getExpression();

	if (!expression) {
		attribute.setInitializer(`{hlm(${JSON.stringify(tailwindClasses)})}`);
		return;
	}

	if (isStringLiteralLike(expression)) {
		const existing = expression.getLiteralText();
		const updated = removeCnClasses(mergeClasses(tailwindClasses, existing));
		expression.setLiteralValue(updated);
		return;
	}

	if (Node.isCallExpression(expression) && isCnCall(expression)) {
		const firstArg = expression.getArguments()[0];
		if (isStringLiteralLike(firstArg)) {
			const existing = firstArg.getLiteralText();
			const updated = removeCnClasses(mergeClasses(tailwindClasses, existing));
			firstArg.setLiteralValue(updated);

			for (let i = 1; i < expression.getArguments().length; i++) {
				const arg = expression.getArguments()[i];
				if (isStringLiteralLike(arg)) {
					const argText = arg.getLiteralText();
					const cleaned = removeCnClasses(argText);
					if (cleaned !== argText) {
						arg.setLiteralValue(cleaned);
					}
				}
			}

			removeEmptyArgumentsFromCnCall(expression);
			return;
		}

		const argumentTexts = expression
			.getArguments()
			.map((argument) => {
				if (isStringLiteralLike(argument)) {
					const cleaned = removeCnClasses(argument.getLiteralText());
					return cleaned ? JSON.stringify(cleaned) : null;
				}
				return argument.getText();
			})
			.filter((arg): arg is string => arg !== null);

		const updatedArguments = [JSON.stringify(tailwindClasses), ...argumentTexts];

		attribute.setInitializer(`{hlm(${updatedArguments.join(', ')})}`);
		return;
	}

	attribute.setInitializer(`{hlm(${JSON.stringify(tailwindClasses)}, ${expression.getText()})}`);
}

function mergeClasses(newClasses: string, existing: string) {
	return twMerge(newClasses, existing);
}

function isCnCall(call: CallExpression) {
	const expression = call.getExpression();
	return Node.isIdentifier(expression) && expression.getText() === 'hlm';
}

function applyToMergePropsCalls(sourceFile: SourceFile, styleMap: StyleMap, matchedClasses: Set<string>) {
	sourceFile.forEachDescendant((node) => {
		if (!Node.isCallExpression(node)) {
			return;
		}

		const expression = node.getExpression();
		if (!Node.isIdentifier(expression) || expression.getText() !== 'mergeProps') {
			return;
		}

		// Look for object literals in mergeProps arguments
		for (const arg of node.getArguments()) {
			if (!Node.isObjectLiteralExpression(arg)) {
				continue;
			}

			// Find className property in the object literal
			const classNameProp = arg
				.getProperties()
				.find(
					(prop) =>
						Node.isPropertyAssignment(prop) &&
						Node.isIdentifier(prop.getNameNode()) &&
						prop.getNameNode().getText() === 'className',
				);

			if (!classNameProp || !Node.isPropertyAssignment(classNameProp)) {
				continue;
			}

			const classNameInitializer = classNameProp.getInitializer();
			if (!classNameInitializer) {
				continue;
			}

			// Handle hlm() calls in className
			if (Node.isCallExpression(classNameInitializer) && isCnCall(classNameInitializer)) {
				const hlmClasses = extractCnClassesFromCnCall(classNameInitializer);

				if (hlmClasses.length === 0) {
					continue;
				}

				const unmatchedClasses = hlmClasses.filter((hlmClass) => !matchedClasses.has(hlmClass));

				if (unmatchedClasses.length === 0) {
					// Clean up spartan-* classes even if already matched
					cleanCnClassesFromCnCall(classNameInitializer);
					continue;
				}

				const tailwindClassesToApply = unmatchedClasses
					.map((hlmClass) => styleMap[hlmClass])
					.filter((classes): classes is string => Boolean(classes));

				if (tailwindClassesToApply.length > 0) {
					const mergedClasses = tailwindClassesToApply.join(' ');
					applyClassesToCnCall(classNameInitializer, mergedClasses, matchedClasses, unmatchedClasses);
				} else {
					cleanCnClassesFromCnCall(classNameInitializer);
				}
			}
		}
	});
}

function extractCnClassesFromCnCall(hlmCall: CallExpression): string[] {
	const classes: string[] = [];

	for (const argument of hlmCall.getArguments()) {
		if (isStringLiteralLike(argument)) {
			classes.push(...extractCnClasses(argument.getLiteralText()));
		}
	}

	return classes;
}

function cleanCnClassesFromCnCall(hlmCall: CallExpression) {
	for (const argument of hlmCall.getArguments()) {
		if (isStringLiteralLike(argument)) {
			const cleaned = removeCnClasses(argument.getLiteralText());
			argument.setLiteralValue(cleaned);
		}
	}

	removeEmptyArgumentsFromCnCall(hlmCall);
}

function applyClassesToCnCall(
	hlmCall: CallExpression,
	tailwindClasses: string,
	matchedClasses: Set<string>,
	unmatchedClasses: string[],
) {
	const firstArg = hlmCall.getArguments()[0];

	if (isStringLiteralLike(firstArg)) {
		const existing = firstArg.getLiteralText();
		const updated = removeCnClasses(mergeClasses(tailwindClasses, existing));
		firstArg.setLiteralValue(updated);

		// Mark classes as matched
		unmatchedClasses.forEach((hlmClass) => matchedClasses.add(hlmClass));

		// Clean up spartan-* classes from remaining arguments
		for (let i = 1; i < hlmCall.getArguments().length; i++) {
			const arg = hlmCall.getArguments()[i];
			if (isStringLiteralLike(arg)) {
				const argText = arg.getLiteralText();
				const cleaned = removeCnClasses(argText);
				if (cleaned !== argText) {
					arg.setLiteralValue(cleaned);
				}
			}
		}

		removeEmptyArgumentsFromCnCall(hlmCall);
		return;
	}

	// If first arg is not a string literal, prepend tailwind classes
	const argumentTexts = hlmCall
		.getArguments()
		.map((argument) => {
			if (isStringLiteralLike(argument)) {
				const cleaned = removeCnClasses(argument.getLiteralText());
				return cleaned ? JSON.stringify(cleaned) : null;
			}
			return argument.getText();
		})
		.filter((arg): arg is string => arg !== null);

	const updatedArguments = [JSON.stringify(tailwindClasses), ...argumentTexts];

	// Mark classes as matched
	unmatchedClasses.forEach((hlmClass) => matchedClasses.add(hlmClass));

	const parent = hlmCall.getParent();
	if (parent) {
		hlmCall.replaceWithText(`hlm(${updatedArguments.join(', ')})`);
	}
}
