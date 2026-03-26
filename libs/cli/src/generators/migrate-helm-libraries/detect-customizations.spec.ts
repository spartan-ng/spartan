import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import type { Primitive } from '../ui/primitives';
import {
	categorizeLibraries,
	generateLibraryMetadata,
	getCustomizationDetails,
	getMetadata,
	isLibraryCustomized,
	saveMetadata,
	updateLibraryMetadata,
	type SpartanMetadata,
} from './detect-customizations';

describe('detect-customizations', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	describe('getMetadata and saveMetadata', () => {
		it('should return empty metadata when file does not exist', () => {
			const metadata = getMetadata(tree);

			expect(metadata).toEqual({ libraries: {} });
		});

		it('should save and retrieve metadata', () => {
			const metadata: SpartanMetadata = {
				libraries: {
					button: {
						version: '1.0.0',
						hash: 'abc123',
						timestamp: Date.now(),
						files: {
							'src/index.ts': 'hash1',
							'src/lib/hlm-button.ts': 'hash2',
						},
					},
				},
			};

			saveMetadata(tree, metadata);

			const retrieved = getMetadata(tree);
			expect(retrieved).toEqual(metadata);
		});

		it('should handle malformed metadata file gracefully', () => {
			tree.write('.spartan/library-metadata.json', 'invalid json');

			const metadata = getMetadata(tree);
			expect(metadata).toEqual({ libraries: {} });
		});
	});

	describe('generateLibraryMetadata', () => {
		it('should generate metadata for a library with files', () => {
			// Create a mock library structure
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton {}');
			tree.write('libs/button/README.md', '# Button Library');

			const metadata = generateLibraryMetadata(tree, 'libs/button', '1.0.0');

			expect(metadata.version).toBe('1.0.0');
			expect(metadata.hash).toBeDefined();
			expect(metadata.timestamp).toBeDefined();
			expect(metadata.files['src/index.ts']).toBeDefined();
			expect(metadata.files['src/lib/hlm-button.ts']).toBeDefined();
			expect(metadata.files['README.md']).toBeDefined();
			expect(Object.keys(metadata.files)).toHaveLength(3);
		});

		it('should generate consistent hashes for unchanged content', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');

			const metadata1 = generateLibraryMetadata(tree, 'libs/button', '1.0.0');
			const metadata2 = generateLibraryMetadata(tree, 'libs/button', '1.0.0');

			expect(metadata1.hash).toBe(metadata2.hash);
			expect(metadata1.files['src/index.ts']).toBe(metadata2.files['src/index.ts']);
		});

		it('should generate different hashes for changed content', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');
			const metadata1 = generateLibraryMetadata(tree, 'libs/button', '1.0.0');

			tree.write('libs/button/src/index.ts', 'export * from "./lib/button-modified";');
			const metadata2 = generateLibraryMetadata(tree, 'libs/button', '1.0.0');

			expect(metadata1.hash).not.toBe(metadata2.hash);
			expect(metadata1.files['src/index.ts']).not.toBe(metadata2.files['src/index.ts']);
		});

		it('should handle empty library directory', () => {
			const metadata = generateLibraryMetadata(tree, 'libs/empty', '1.0.0');

			expect(metadata.version).toBe('1.0.0');
			expect(metadata.files).toEqual({});
		});

		it('should skip node_modules and .spartan directories', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');
			tree.write('libs/button/node_modules/some-package/index.js', 'module.exports = {};');
			tree.write('libs/button/.spartan/metadata.json', '{}');

			const metadata = generateLibraryMetadata(tree, 'libs/button', '1.0.0');

			expect(metadata.files['src/index.ts']).toBeDefined();
			expect(metadata.files['node_modules/some-package/index.js']).toBeUndefined();
			expect(metadata.files['.spartan/metadata.json']).toBeUndefined();
		});
	});

	describe('isLibraryCustomized', () => {
		it('should return true when no metadata exists', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');

			const isCustomized = isLibraryCustomized(tree, 'libs/button', 'button');

			expect(isCustomized).toBe(true);
		});

		it('should return false when library is unchanged', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');

			const metadata = generateLibraryMetadata(tree, 'libs/button', '1.0.0');
			saveMetadata(tree, { libraries: { button: metadata } });

			const isCustomized = isLibraryCustomized(tree, 'libs/button', 'button');

			expect(isCustomized).toBe(false);
		});

		it('should return true when library content is modified', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');

			const metadata = generateLibraryMetadata(tree, 'libs/button', '1.0.0');
			saveMetadata(tree, { libraries: { button: metadata } });

			// Modify the library
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button-modified";');

			const isCustomized = isLibraryCustomized(tree, 'libs/button', 'button');

			expect(isCustomized).toBe(true);
		});

		it('should return true when files are added', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');

			const metadata = generateLibraryMetadata(tree, 'libs/button', '1.0.0');
			saveMetadata(tree, { libraries: { button: metadata } });

			// Add a new file
			tree.write('libs/button/src/lib/custom-variant.ts', 'export class CustomVariant {}');

			const isCustomized = isLibraryCustomized(tree, 'libs/button', 'button');

			expect(isCustomized).toBe(true);
		});

		it('should return true when files are deleted', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton {}');

			const metadata = generateLibraryMetadata(tree, 'libs/button', '1.0.0');
			saveMetadata(tree, { libraries: { button: metadata } });

			// Delete a file
			tree.delete('libs/button/src/lib/hlm-button.ts');

			const isCustomized = isLibraryCustomized(tree, 'libs/button', 'button');

			expect(isCustomized).toBe(true);
		});
	});

	describe('getCustomizationDetails', () => {
		it('should return not customized for unchanged library', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton {}');

			const metadata = generateLibraryMetadata(tree, 'libs/button', '1.0.0');
			saveMetadata(tree, { libraries: { button: metadata } });

			const details = getCustomizationDetails(tree, 'libs/button', 'button');

			expect(details.isCustomized).toBe(false);
			expect(details.addedFiles).toEqual([]);
			expect(details.modifiedFiles).toEqual([]);
			expect(details.deletedFiles).toEqual([]);
		});

		it('should detect modified files', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton {}');

			const metadata = generateLibraryMetadata(tree, 'libs/button', '1.0.0');
			saveMetadata(tree, { libraries: { button: metadata } });

			// Modify a file
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton { modified = true; }');

			const details = getCustomizationDetails(tree, 'libs/button', 'button');

			expect(details.isCustomized).toBe(true);
			expect(details.modifiedFiles).toContain('src/lib/hlm-button.ts');
			expect(details.addedFiles).toEqual([]);
			expect(details.deletedFiles).toEqual([]);
		});

		it('should detect added files', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');

			const metadata = generateLibraryMetadata(tree, 'libs/button', '1.0.0');
			saveMetadata(tree, { libraries: { button: metadata } });

			// Add new files
			tree.write('libs/button/src/lib/custom-variant.ts', 'export class CustomVariant {}');
			tree.write('libs/button/src/lib/custom-styles.ts', 'export const styles = {};');

			const details = getCustomizationDetails(tree, 'libs/button', 'button');

			expect(details.isCustomized).toBe(true);
			expect(details.addedFiles).toContain('src/lib/custom-variant.ts');
			expect(details.addedFiles).toContain('src/lib/custom-styles.ts');
			expect(details.modifiedFiles).toEqual([]);
			expect(details.deletedFiles).toEqual([]);
		});

		it('should detect deleted files', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton {}');
			tree.write('libs/button/src/lib/hlm-button-footer.ts', 'export class Footer {}');

			const metadata = generateLibraryMetadata(tree, 'libs/button', '1.0.0');
			saveMetadata(tree, { libraries: { button: metadata } });

			// Delete files
			tree.delete('libs/button/src/lib/hlm-button-footer.ts');

			const details = getCustomizationDetails(tree, 'libs/button', 'button');

			expect(details.isCustomized).toBe(true);
			expect(details.deletedFiles).toContain('src/lib/hlm-button-footer.ts');
			expect(details.addedFiles).toEqual([]);
			expect(details.modifiedFiles).toEqual([]);
		});

		it('should detect all types of changes simultaneously', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton {}');
			tree.write('libs/button/src/lib/to-delete.ts', 'export class ToDelete {}');

			const metadata = generateLibraryMetadata(tree, 'libs/button', '1.0.0');
			saveMetadata(tree, { libraries: { button: metadata } });

			// Modify one file
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton { modified = true; }');
			// Add one file
			tree.write('libs/button/src/lib/new-file.ts', 'export class NewFile {}');
			// Delete one file
			tree.delete('libs/button/src/lib/to-delete.ts');

			const details = getCustomizationDetails(tree, 'libs/button', 'button');

			expect(details.isCustomized).toBe(true);
			expect(details.modifiedFiles).toContain('src/lib/hlm-button.ts');
			expect(details.addedFiles).toContain('src/lib/new-file.ts');
			expect(details.deletedFiles).toContain('src/lib/to-delete.ts');
		});

		it('should return customized when no metadata exists', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');

			const details = getCustomizationDetails(tree, 'libs/button', 'button');

			expect(details.isCustomized).toBe(true);
			expect(details.addedFiles).toEqual([]);
			expect(details.modifiedFiles).toEqual([]);
			expect(details.deletedFiles).toEqual([]);
		});
	});

	describe('updateLibraryMetadata', () => {
		it('should create new metadata for a library', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton {}');

			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');

			const metadata = getMetadata(tree);
			expect(metadata.libraries.button).toBeDefined();
			expect(metadata.libraries.button.version).toBe('1.0.0');
			expect(metadata.libraries.button.files['src/index.ts']).toBeDefined();
			expect(metadata.libraries.button.files['src/lib/hlm-button.ts']).toBeDefined();
		});

		it('should update existing metadata for a library', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');

			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');
			const metadata1 = getMetadata(tree);
			const hash1 = metadata1.libraries.button.hash;

			// Modify the library
			tree.write('libs/button/src/lib/new-file.ts', 'export class NewFile {}');

			updateLibraryMetadata(tree, 'button', 'libs/button', '2.0.0');
			const metadata2 = getMetadata(tree);

			expect(metadata2.libraries.button.version).toBe('2.0.0');
			expect(metadata2.libraries.button.hash).not.toBe(hash1);
			expect(metadata2.libraries.button.files['src/lib/new-file.ts']).toBeDefined();
		});

		it('should preserve other libraries metadata when updating one', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');
			tree.write('libs/card/src/index.ts', 'export * from "./lib/card";');

			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');
			updateLibraryMetadata(tree, 'card', 'libs/card', '1.0.0');

			const metadata1 = getMetadata(tree);
			const cardHash = metadata1.libraries.card.hash;

			// Update only button
			tree.write('libs/button/src/lib/new-file.ts', 'export class NewFile {}');
			updateLibraryMetadata(tree, 'button', 'libs/button', '2.0.0');

			const metadata2 = getMetadata(tree);
			expect(metadata2.libraries.card.hash).toBe(cardHash);
			expect(metadata2.libraries.button.version).toBe('2.0.0');
			expect(metadata2.libraries.card.version).toBe('1.0.0');
		});
	});

	describe('categorizeLibraries', () => {
		it('should categorize all libraries as unchanged when none are modified', () => {
			const primitives: Primitive[] = ['button', 'card', 'dialog'];

			primitives.forEach((primitive) => {
				tree.write(`libs/${primitive}/src/index.ts`, `export * from "./lib/${primitive}";`);
				updateLibraryMetadata(tree, primitive, `libs/${primitive}`, '1.0.0');
			});

			const getLibraryPath = (primitive: Primitive) => `libs/${primitive}`;
			const result = categorizeLibraries(tree, primitives, getLibraryPath);

			expect(result.unchanged).toEqual(primitives);
			expect(result.customized).toEqual([]);
		});

		it('should categorize modified libraries as customized', () => {
			const primitives: Primitive[] = ['button', 'card', 'dialog'];

			primitives.forEach((primitive) => {
				tree.write(`libs/${primitive}/src/index.ts`, `export * from "./lib/${primitive}";`);
				updateLibraryMetadata(tree, primitive, `libs/${primitive}`, '1.0.0');
			});

			// Modify button and dialog
			tree.write('libs/button/src/lib/custom.ts', 'export class Custom {}');
			tree.write('libs/dialog/src/index.ts', 'export * from "./lib/dialog-modified";');

			const getLibraryPath = (primitive: Primitive) => `libs/${primitive}`;
			const result = categorizeLibraries(tree, primitives, getLibraryPath);

			expect(result.unchanged).toEqual(['card']);
			expect(result.customized).toHaveLength(2);
			expect(result.customized.map((c) => c.primitive)).toContain('button');
			expect(result.customized.map((c) => c.primitive)).toContain('dialog');
		});

		it('should provide customization details for customized libraries', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton {}');
			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');

			// Modify the library
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton { modified = true; }');
			tree.write('libs/button/src/lib/custom.ts', 'export class Custom {}');

			const getLibraryPath = (primitive: Primitive) => `libs/${primitive}`;
			const result = categorizeLibraries(tree, ['button'], getLibraryPath);

			expect(result.customized).toHaveLength(1);
			expect(result.customized[0].primitive).toBe('button');
			expect(result.customized[0].details.isCustomized).toBe(true);
			expect(result.customized[0].details.modifiedFiles).toContain('src/lib/hlm-button.ts');
			expect(result.customized[0].details.addedFiles).toContain('src/lib/custom.ts');
		});

		it('should handle empty library list', () => {
			const getLibraryPath = (primitive: Primitive) => `libs/${primitive}`;
			const result = categorizeLibraries(tree, [], getLibraryPath);

			expect(result.unchanged).toEqual([]);
			expect(result.customized).toEqual([]);
		});

		it('should categorize libraries without metadata as customized', () => {
			tree.write('libs/button/src/index.ts', 'export * from "./lib/button";');

			const getLibraryPath = (primitive: Primitive) => `libs/${primitive}`;
			const result = categorizeLibraries(tree, ['button'], getLibraryPath);

			expect(result.unchanged).toEqual([]);
			expect(result.customized).toHaveLength(1);
			expect(result.customized[0].primitive).toBe('button');
		});
	});
});
