import { type Tree, readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { extractPrimitiveCodeGenerator } from './generator';

describe('extractPrimitiveCodeGenerator', () => {
	let tree: Tree;
	const componentsBasePath = 'apps/app/src/app/pages/(components)/components';

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('should produce a single JSON file with all snippets', async () => {
		// Arrange
		tree.write(
			`${componentsBasePath}/button/button.preview.ts`,
			`import { Component } from '@angular/core';
			@Component({ selector: 'spartan-button-preview', template: '<button>Button</button>' })
			export class ButtonPreviewComponent {}`,
		);
		tree.write(
			`${componentsBasePath}/accordion/accordion.preview.ts`,
			`import { Component } from '@angular/core';
			@Component({ selector: 'spartan-accordion-preview', template: '<div>Accordion</div>' })
			export class AccordionPreviewComponent {}`,
		);

		// Act
		await extractPrimitiveCodeGenerator(tree);

		// Assert
		const outputPath = 'apps/app/src/public/data/primitives-snippets.json';
		expect(tree.exists(outputPath)).toBe(true);

		const snippets = readJson(tree, outputPath);
		expect(snippets['button']).toBeDefined();
		expect(snippets['button']['default']).toContain('spartan-button-preview');
		expect(snippets['accordion']).toBeDefined();
		expect(snippets['accordion']['default']).toContain('spartan-accordion-preview');
	});

	it('should handle multiple examples for a single primitive', async () => {
		// Arrange
		tree.write(
			`${componentsBasePath}/toggle/toggle.preview.ts`,
			`import { Component } from '@angular/core';
			@Component({ selector: 'spartan-toggle-preview', template: '<button>Toggle</button>' })
			export class TogglePreviewComponent {}`,
		);
		tree.write(
			`${componentsBasePath}/toggle/toggle-disabled.example.ts`,
			`import { Component } from '@angular/core';
			@Component({ selector: 'spartan-toggle-disabled', template: '<button disabled>Disabled</button>' })
			export class ToggleDisabledComponent {}`,
		);

		// Act
		await extractPrimitiveCodeGenerator(tree);

		// Assert
		const outputPath = 'apps/app/src/public/data/primitives-snippets.json';
		const snippets = readJson(tree, outputPath);

		expect(snippets['toggle']).toBeDefined();
		expect(snippets['toggle']['default']).toContain('spartan-toggle-preview');
		expect(snippets['toggle']['disabled']).toContain('spartan-toggle-disabled');
	});

	it('should an empty json file if no primitives are found', async () => {
		// Arrange
		tree.write(`${componentsBasePath}/empty/some-other-file.ts`, 'const a = 1;');

		// Act
		await extractPrimitiveCodeGenerator(tree);

		// Assert
		const outputPath = 'apps/app/src/public/data/primitives-snippets.json';
		const snippets = readJson(tree, outputPath);
		expect(tree.exists(outputPath)).toBe(true);
		expect(Object.keys(snippets).length).toBe(0);
	});
});
