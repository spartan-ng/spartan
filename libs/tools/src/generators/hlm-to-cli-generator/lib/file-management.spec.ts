import type { Tree } from '@nx/devkit'; // update with actual path
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { renameToTemplate } from './file-management';

describe('renameToTemplate', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('should replace @spartan-ng/helm with <%- importAlias %> and keep subpaths', () => {
		// Arrange: create files
		tree.write(
			'src/lib/accordion.ts',
			`
      import { BrnAccordion } from '@spartan-ng/helm/accordion';
      import { hlm } from '@spartan-ng/helm/core';
      import { somethingElse } from 'other-package';
    `,
		);

		tree.write(
			'src/lib/button.ts',
			`
      import { HlmButton } from '@spartan-ng/helm/button';
    `,
		);

		// Act: run the rename & replace function
		renameToTemplate(tree, 'src/lib');

		// Assert: check file contents
		const accordionContent = tree.read('src/lib/accordion.ts.template', 'utf-8');
		expect(accordionContent).toContain("from '<%- importAlias %>/accordion'");
		expect(accordionContent).toContain("from '<%- importAlias %>/core'");
		expect(accordionContent).toContain("from 'other-package'"); // unchanged

		const buttonContent = tree.read('src/lib/button.ts.template', 'utf-8');
		expect(buttonContent).toContain("from '<%- importAlias %>/button'");

		// Assert: old files are renamed
		expect(tree.exists('src/lib/accordion.ts')).toBe(false);
		expect(tree.exists('src/lib/button.ts')).toBe(false);
		expect(tree.exists('src/lib/accordion.ts.template')).toBe(true);
		expect(tree.exists('src/lib/button.ts.template')).toBe(true);
	});
});
