import type { ExecutorContext } from '@nx/devkit';
import fs from 'fs';
import os from 'os';
import path from 'path';
import runExecutor from './executor';

describe('generate-hlm-component-preview executor', () => {
	let tmpDir: string;

	function writeFile(relativePath: string, content: string) {
		const fullPath = path.join(tmpDir, relativePath);
		fs.mkdirSync(path.dirname(fullPath), { recursive: true });
		fs.writeFileSync(fullPath, content);
	}

	function readJson(relativePath: string) {
		return JSON.parse(fs.readFileSync(path.join(tmpDir, relativePath), 'utf-8'));
	}

	beforeEach(() => {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hlm-preview-test-'));

		writeFile(
			'libs/cli/src/generators/ui/libs/button/files/lib/button.component.ts',
			`
import forwardRef, { Component, ChangeDetectionStrategy } from '@angular/core';
import { localUtil } from './utils';
@Component({
  selector: 'app-button',
  template: '<button></button>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {}
    `,
		);

		writeFile(
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

		writeFile('libs/registry/src/styles/style-vega.css', '/* fake css */');
		writeFile('apps/app/src/app/pages/(components)/components/button/.keep', '');
	});

	afterEach(() => {
		fs.rmSync(tmpDir, { recursive: true, force: true });
	});

	it('generates merged imports for Angular components', async () => {
		const context = { root: tmpDir } as ExecutorContext;
		const result = await runExecutor({} as Record<string, never>, context);

		expect(result.success).toBe(true);

		const data = readJson('apps/app/src/public/data/manual-install-snippets.json');

		expect(data.button['vega']).toContain(
			"import forwardRef, { ChangeDetectionStrategy, Component, type Input } from '@angular/core'",
		);

		expect(data.button['vega']).toContain('export class ButtonComponent');
		expect(data.button['vega']).toContain('export class ButtonGroupComponent');
	});

	it('ignores relative imports inside Angular primitives', async () => {
		writeFile(
			'libs/cli/src/generators/ui/libs/button/files/lib/local-util.ts',
			`
import { helper } from './utils';
export function localUtil() {}
    `,
		);

		const context = { root: tmpDir } as ExecutorContext;
		await runExecutor({} as Record<string, never>, context);

		const data = readJson('apps/app/src/public/data/manual-install-snippets.json');
		expect(JSON.stringify(data.button['vega'])).not.toContain('./utils');
	});

	it('replaces <%- importAlias %> in Angular imports', async () => {
		writeFile(
			'libs/cli/src/generators/ui/libs/button/files/lib/alias.ts',
			`
import { HlmButton } from '<%- importAlias %>/button';
export class HlmButtonComp {}
    `,
		);

		const context = { root: tmpDir } as ExecutorContext;
		await runExecutor({} as Record<string, never>, context);

		const data = readJson('apps/app/src/public/data/manual-install-snippets.json');
		expect(data.button['vega']).toContain('@spartan-ng/helm/button');
	});
});
