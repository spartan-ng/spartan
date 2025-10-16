import { formatFiles, type Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import type * as ts from 'typescript';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateNamingConventionsGeneratorSchema } from './schema';

export async function migrateNamingConventionGenerator(
	tree: Tree,
	{ skipFormat }: MigrateNamingConventionsGeneratorSchema,
) {
	updateBrainIdentifiers(tree);
	updateHelmIdentifiers(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

const renamedIdentifiers: Record<string, string> = {
	BrnTooltipContentDirective: 'BrnTooltipContentTemplate',
	BrnSelectValueDirective: 'BrnSelectValueTemplate',
	HlmSelectValueDirective: 'HlmSelectValueTemplate',
	HlmMenuItemRadioComponent: 'HlmMenuItemRadioIndicator',
};

/**
 * Detect any imports from `@spartan-ng/brain/*` that need to be updated.
 * Get the identifiers that need to be replaced, and then replace them.
 */
function updateBrainIdentifiers(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		if (!path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path).toString('utf-8');

		const importDeclarations = tsquery.query<ts.ImportDeclaration>(content, 'ImportDeclaration');

		if (importDeclarations.length === 0) {
			return;
		}

		const identifiersToReplace: string[] = [];

		for (const importDeclaration of importDeclarations) {
			const moduleSpecifier = importDeclaration.moduleSpecifier.getText();

			if (moduleSpecifier.includes('@spartan-ng/brain/')) {
				const identifiers = tsquery.query(importDeclaration, 'Identifier');

				// we only care about identifiers that end in 'Directive', 'Component'
				for (const identifier of identifiers) {
					const identifierText = identifier.getText();

					if (identifierText.endsWith('Directive') || identifierText.endsWith('Component')) {
						identifiersToReplace.push(identifierText);
					}
				}
			}
		}

		// find all the identifiers in the file - we reverse the order to replace the exact identifiers based on position
		const identifiers = tsquery.query<ts.Identifier>(content, 'Identifier').reverse();

		for (const identifier of identifiers) {
			if (!identifiersToReplace.includes(identifier.getText())) {
				continue;
			}

			// determine the new identifier based on the old one, if it exists in the mapping use it, otherwise just remove
			// the trailing 'Directive' or 'Component'
			const oldIdentifier = identifier.getText();
			const newIdentifier = renamedIdentifiers[oldIdentifier] || oldIdentifier.replace(/(Directive|Component)$/, '');

			if (newIdentifier !== oldIdentifier) {
				const start = identifier.getStart();
				const end = identifier.getEnd();

				content = content.slice(0, start) + newIdentifier + content.slice(end);
			}
		}

		tree.write(path, content);
	});
}

/**
 * Helm identifiers are not necessarily just imports as the class declarations
 * are defined in the users codebase so we need to update all identifiers that
 * start with `Hlm` and end with `Directive` or `Component`.
 * We also must check for known identifiers that have been renamed.
 */
function updateHelmIdentifiers(tree: Tree) {
	visitFiles(tree, '/', (path) => {
		if (!path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path).toString('utf-8');

		const identifiers = tsquery.query<ts.Identifier>(content, 'Identifier').reverse();
		const identifiersToReplace: string[] = [];
		for (const identifier of identifiers) {
			const identifierText = identifier.getText();

			if (
				identifierText.startsWith('Hlm') &&
				(identifierText.endsWith('Directive') || identifierText.endsWith('Component'))
			) {
				identifiersToReplace.push(identifierText);
			}
		}

		// replace all identifiers in the content
		for (const oldIdentifier of identifiersToReplace) {
			const newIdentifier = renamedIdentifiers[oldIdentifier] || oldIdentifier.replace(/(Directive|Component)$/, '');

			content = content.replace(new RegExp(`\\b${oldIdentifier}\\b`, 'g'), newIdentifier);
		}

		tree.write(path, content);
	});
}

export default migrateNamingConventionGenerator;
