import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import generateHlmComponentManualInstallation from './generator';

describe('generateHlmComponentManualInstallation (Angular)', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();

		// Fake Angular component files
		tree.write(
			'libs/cli/src/generators/ui/libs/button/files/lib/button.component.ts',
			`
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { localUtil } from './utils';
@Component({
  selector: 'app-button',
  template: '<button></button>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {}
    `,
		);

		tree.write(
			'libs/cli/src/generators/ui/libs/button/files/lib/button-group.component.ts',
			`
import { Component, type Input } from '@angular/core';
@Component({
  selector: 'app-button-group',
  template: '<div></div>'
})
export class ButtonGroupComponent {}
    `,
		);

		// Fake style file
		tree.write('libs/registry/src/styles/style-vega.css', '/* fake css */');

		// Create the components base directory (Nx Tree expects it)
		tree.write('apps/app/src/app/pages/(components)/components/button/.keep', '');
	});

	it('generates merged imports for Angular components', async () => {
		await generateHlmComponentManualInstallation(tree);

		const outputPath = 'apps/app/src/public/data/manual-install-snippets.json';
		expect(tree.exists(outputPath)).toBe(true);

		const raw = tree.read(outputPath, 'utf-8');
		const data = JSON.parse(raw);

		// Check imports are merged correctly
		expect(data.button).toContain("import { ChangeDetectionStrategy, Component, type Input } from '@angular/core'");

		// Check both component classes are included
		expect(data.button).toContain('export class ButtonComponent');
		expect(data.button).toContain('export class ButtonGroupComponent');
	});

	it('ignores relative imports inside Angular primitives', async () => {
		tree.write(
			'libs/cli/src/generators/ui/libs/button/files/lib/local-util.ts',
			`
import { helper } from './utils';
export function localUtil() {}
    `,
		);

		await generateHlmComponentManualInstallation(tree);

		const raw = tree.read('apps/app/src/public/data/manual-install-snippets.json', 'utf-8');
		const data = JSON.parse(raw);

		// './utils' should NOT appear in the merged imports
		expect(data.button).not.toContain('./utils');
	});

	it('replaces <%- importAlias %> in Angular imports', async () => {
		tree.write(
			'libs/cli/src/generators/ui/libs/button/files/lib/alias.ts',
			`
import { HlmButton } from '<%- importAlias %>/button';
export class HlmButtonComp {}
    `,
		);

		await generateHlmComponentManualInstallation(tree);

		const raw = tree.read('apps/app/src/public/data/manual-install-snippets.json', 'utf-8');
		const data = JSON.parse(raw);

		expect(data.button).toContain('@spartan-ng/helm/button');
	});
});
