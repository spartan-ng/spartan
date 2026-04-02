import type { ExecutorContext } from '@nx/devkit';
import fs from 'fs';
import os from 'os';
import path from 'path';
import runExecutor from './executor';

describe('generate-primitive-snippets executor', () => {
	let tmpDir: string;
	const componentsBasePath = 'apps/app/src/app/pages/(components)/components';

	function writeFile(relativePath: string, content: string) {
		const fullPath = path.join(tmpDir, relativePath);
		fs.mkdirSync(path.dirname(fullPath), { recursive: true });
		fs.writeFileSync(fullPath, content);
	}

	function readJson(relativePath: string) {
		return JSON.parse(fs.readFileSync(path.join(tmpDir, relativePath), 'utf-8'));
	}

	beforeEach(() => {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'primitive-snippets-test-'));
	});

	afterEach(() => {
		fs.rmSync(tmpDir, { recursive: true, force: true });
	});

	it('should produce a single JSON file with all snippets', async () => {
		writeFile(
			`${componentsBasePath}/button/button.preview.ts`,
			`import { Component } from '@angular/core';
			@Component({ selector: 'spartan-button-preview', template: '<button>Button</button>' })
			export class ButtonPreviewComponent {}`,
		);
		writeFile(
			`${componentsBasePath}/accordion/accordion.preview.ts`,
			`import { Component } from '@angular/core';
			@Component({ selector: 'spartan-accordion-preview', template: '<div>Accordion</div>' })
			export class AccordionPreviewComponent {}`,
		);

		const context = { root: tmpDir } as ExecutorContext;
		const result = await runExecutor({} as Record<string, never>, context);

		expect(result.success).toBe(true);

		const outputPath = 'apps/app/src/public/data/primitives-snippets.json';
		expect(fs.existsSync(path.join(tmpDir, outputPath))).toBe(true);

		const snippets = readJson(outputPath);
		expect(snippets['button']).toBeDefined();
		expect(snippets['button']['default']).toContain('spartan-button-preview');
		expect(snippets['accordion']).toBeDefined();
		expect(snippets['accordion']['default']).toContain('spartan-accordion-preview');
	});

	it('should handle multiple examples for a single primitive', async () => {
		writeFile(
			`${componentsBasePath}/toggle/toggle.preview.ts`,
			`import { Component } from '@angular/core';
			@Component({ selector: 'spartan-toggle-preview', template: '<button>Toggle</button>' })
			export class TogglePreviewComponent {}`,
		);
		writeFile(
			`${componentsBasePath}/toggle/toggle-disabled.example.ts`,
			`import { Component } from '@angular/core';
			@Component({ selector: 'spartan-toggle-disabled', template: '<button disabled>Disabled</button>' })
			export class ToggleDisabledComponent {}`,
		);

		const context = { root: tmpDir } as ExecutorContext;
		const result = await runExecutor({} as Record<string, never>, context);

		expect(result.success).toBe(true);

		const snippets = readJson('apps/app/src/public/data/primitives-snippets.json');

		expect(snippets['toggle']).toBeDefined();
		expect(snippets['toggle']['default']).toContain('spartan-toggle-preview');
		expect(snippets['toggle']['disabled']).toContain('spartan-toggle-disabled');
	});

	it('should write an empty json file if no primitives are found', async () => {
		writeFile(`${componentsBasePath}/empty/some-other-file.ts`, 'const a = 1;');

		const context = { root: tmpDir } as ExecutorContext;
		const result = await runExecutor({} as Record<string, never>, context);

		expect(result.success).toBe(true);

		const outputPath = 'apps/app/src/public/data/primitives-snippets.json';
		expect(fs.existsSync(path.join(tmpDir, outputPath))).toBe(true);

		const snippets = readJson(outputPath);
		expect(Object.keys(snippets).length).toBe(0);
	});
});
