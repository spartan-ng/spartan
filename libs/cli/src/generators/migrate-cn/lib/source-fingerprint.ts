import { createHash } from 'node:crypto';
import ts from 'typescript';

const CLOSING_TOKENS = new Set([
	ts.SyntaxKind.CloseParenToken,
	ts.SyntaxKind.CloseBracketToken,
	ts.SyntaxKind.CloseBraceToken,
	ts.SyntaxKind.GreaterThanToken,
]);

/**
 * Creates a fingerprint of a TypeScript source that ignores formatting, so a file generated from a
 * template still matches after the user ran their formatter on it. Comments, whitespace, quote style,
 * semicolons, trailing commas and parentheses around a single arrow function parameter are ignored.
 */
export function sourceFingerprint(source: string): string {
	const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.Standard, source);
	const tokens: { kind: ts.SyntaxKind; text: string }[] = [];

	for (let kind = scanner.scan(); kind !== ts.SyntaxKind.EndOfFileToken; kind = scanner.scan()) {
		if (kind === ts.SyntaxKind.SemicolonToken) continue;

		const isString = kind === ts.SyntaxKind.StringLiteral || kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral;
		tokens.push({ kind, text: isString ? JSON.stringify(scanner.getTokenValue()) : scanner.getTokenText() });
	}

	const normalized: string[] = [];

	for (let i = 0; i < tokens.length; i++) {
		const { kind, text } = tokens[i];

		// trailing comma: `a, b,)` -> `a, b)`
		if (kind === ts.SyntaxKind.CommaToken && tokens[i + 1] && CLOSING_TOKENS.has(tokens[i + 1].kind)) continue;

		// single arrow function parameter: `(c) =>` -> `c =>`
		if (
			kind === ts.SyntaxKind.OpenParenToken &&
			tokens[i + 1]?.kind === ts.SyntaxKind.Identifier &&
			tokens[i + 2]?.kind === ts.SyntaxKind.CloseParenToken &&
			tokens[i + 3]?.kind === ts.SyntaxKind.EqualsGreaterThanToken
		) {
			normalized.push(tokens[i + 1].text);
			i += 2;
			continue;
		}

		normalized.push(text);
	}

	return createHash('sha256').update(normalized.join(' ')).digest('hex');
}
