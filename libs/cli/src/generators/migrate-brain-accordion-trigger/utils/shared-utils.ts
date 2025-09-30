import { type Decorator, type PropertyAssignment, type SourceFile, SyntaxKind } from 'ts-morph';
import { getButtonText, hasSignificantSiblings, type HTMLElement, isInHeading } from './html-utils';

export function shouldProcessFile(file: string): boolean {
	return file.endsWith('.ts') || file.endsWith('.html');
}

export function hasAccordionTriggers(content: string): boolean {
	return content.includes('brnAccordionTrigger') || content.includes('hlmAccordionTrigger');
}

export interface TemplateInfo {
	text: string;
	startLine: number;
	propertyAssignment?: PropertyAssignment; // The AST node for "template: `...`"
	originalQuoteStyle?: string; // '`' or '"' or "'"
}

export function extractInlineTemplate(sourceFile: SourceFile): TemplateInfo | null {
	// Find all @Something decorators in the file
	// (like @Component, @Directive, etc.)
	const decorators = sourceFile.getDescendantsOfKind(SyntaxKind.Decorator);

	for (const decorator of decorators) {
		const template = findComponentTemplate(decorator);
		if (template) return template;
	}

	return null;
}

/**
 * Checks if a decorator is @Component and extracts its template
 *
 * The AST (Abstract Syntax Tree) structure looks like this:
 *
 * Decorator (@Component)
 *   └── CallExpression (Component(...))
 *       └── ObjectLiteralExpression ({...})
 *           └── PropertyAssignment (template: '...')
 *               ├── Identifier (the word "template")
 *               └── StringLiteral (the actual template string)
 *
 * We need to navigate down this tree to find the template!
 */
export function findComponentTemplate(decorator: Decorator): TemplateInfo | null {
	// Step 1: Get the function call part of @Component(...)
	//         We want the Component(...) part
	const callExpression = decorator.getCallExpression();

	// Make sure this is @Component, not @Injectable or something else
	if (callExpression?.getExpression().getText() !== 'Component') {
		return null; // Not a component decorator, skip it
	}

	// Step 2: Get the arguments passed to Component(...)
	//         Usually it's Component({ template: '...', selector: '...' })
	const args = callExpression.getArguments();

	// Make sure there's an object literal as first argument
	if (args.length === 0 || args[0].getKind() !== SyntaxKind.ObjectLiteralExpression) {
		return null; // Component() with no args or weird args, skip
	}

	// Step 3: Get the object literal { template: '...', ... }
	const objLiteral = args[0].asKindOrThrow(SyntaxKind.ObjectLiteralExpression);

	// Step 4: Find the "template" property in the object
	//         We're looking for: template: '...' or template: `...`
	const templateProp = objLiteral.getProperty('template');

	// Make sure we found a template property and it's an assignment
	if (!templateProp || templateProp.getKind() !== SyntaxKind.PropertyAssignment) {
		return null; // No template property, must use templateUrl or external file
	}

	// Step 5: Cast to PropertyAssignment so TypeScript knows what we have
	//         PropertyAssignment means something like: key: value
	const propAssignment = templateProp.asKindOrThrow(SyntaxKind.PropertyAssignment);

	// Step 6: Get the value part of template: VALUE
	//         This is the actual template string
	const initializer = propAssignment.getInitializer();

	if (!initializer) return null; // Shouldn't happen but be safe

	// Step 7: Get the full text including quotes
	//         Could be: `<div>...</div>` or "<div>...</div>" or '<div>...</div>'
	const fullText = initializer.getText();

	// Step 8: Check what kind of string it is
	const isStringLiteral = initializer.getKind() === SyntaxKind.StringLiteral; // "..." or '...'
	const isTemplateLiteral = initializer.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral; // `...`

	if (!isStringLiteral && !isTemplateLiteral) {
		return null; // template is something weird like a variable or function call
	}

	// Step 9: Figure out what quotes were used (we want to preserve them)
	const quoteStyle = fullText[0]; // First character is the quote

	// Step 10: Return all the info we gathered!
	return {
		text: fullText.slice(1, -1), // Remove first and last character (the quotes)
		startLine: initializer.getStartLineNumber(), // For error messages
		propertyAssignment: propAssignment, // Save this so we can modify it later!
		originalQuoteStyle: quoteStyle, // Remember if it was ` or " or '
	};
}

export type ButtonIssue = 'NotInHeading' | 'HasSiblings' | 'NoIssue';

export interface ButtonAnalysis {
	issue: ButtonIssue;
	button: HTMLElement;
	buttonText: string;
	parent: HTMLElement | null;
	line: number;
}

export function analyzeButton(button: HTMLElement): ButtonAnalysis {
	const buttonText = getButtonText(button);
	const parent = button.parentNode as HTMLElement;

	// Check what's wrong (if anything)
	let issue: ButtonIssue = 'NoIssue';

	if (!isInHeading(button)) {
		issue = 'NotInHeading';
	} else if (hasSignificantSiblings(button)) {
		issue = 'HasSiblings';
	}

	return {
		issue,
		button,
		buttonText,
		parent,
		line: button.range?.[0] || 0,
	};
}
