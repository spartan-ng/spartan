import { TestBed } from '@angular/core/testing';
import { StackBlitzMetaService } from '../../core/services/stackblitz-meta.service';
import {
	type GeneratedProject,
	isRunnableExample,
	StackBlitzProjectBuilderService,
} from './stackblitz-project-builder.service';

const EXAMPLE = `import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-preview',
	imports: [HlmButtonImports],
	template: \`<button hlmBtn>Button</button>\`,
})
export class ButtonPreview {}`;

// A stand-in for the build-time captured CLI output (libs/ui/**, real deps + tsconfig paths).
const GENERATED: GeneratedProject = {
	files: {
		'libs/ui/button/src/index.ts': "export * from './lib/hlm-button';",
		'libs/ui/button/src/lib/hlm-button.ts': 'export class HlmButton {}',
		'libs/ui/utils/src/index.ts': 'export function hlm() {}',
		'components.json': '{ "componentsPath": "libs/ui", "importAlias": "@spartan-ng/helm", "style": "vega" }',
	},
	dependencies: {
		'@spartan-ng/brain': '0.0.1-alpha.702',
		'@spartan-ng/helm': '0.0.1-alpha.550', // must be dropped (vendored)
		'@ng-icons/core': '>=32.0.0 <34.0.0',
		'class-variance-authority': '^0.7.0',
		'@angular/core': '>=20.0.0 <22.0.0', // loose range - meta pinned should win
	},
	tsconfigPaths: {
		'@spartan-ng/helm/button': ['./libs/ui/button/src/index.ts'],
		'@spartan-ng/helm/utils': ['./libs/ui/utils/src/index.ts'],
	},
};

function setup() {
	TestBed.configureTestingModule({});
	const builder = TestBed.inject(StackBlitzProjectBuilderService);
	const meta = TestBed.inject(StackBlitzMetaService);

	meta.setMeta({
		baseDependencies: { '@angular/core': '^21.0.0', '@angular/cdk': '^21.0.0', '@spartan-ng/brain': '0.0.1-alpha.702' },
		devDependencies: { '@angular/cli': '^21.0.0', '@angular/build': '^21.0.0' },
		presetCss: "@import 'tw-animate-css';\n@theme inline {\n--color-primary: var(--primary);\n}",
	});

	return { builder };
}

describe('isRunnableExample', () => {
	it('is true for a spartan component example', () => {
		expect(isRunnableExample(EXAMPLE)).toBe(true);
	});

	it('is false for install commands, css and bare imports', () => {
		expect(isRunnableExample('npm i @spartan-ng/brain')).toBe(false);
		expect(isRunnableExample("import { HlmButtonImports } from '@spartan-ng/helm/button';")).toBe(false);
		expect(isRunnableExample(null)).toBe(false);
	});

	it('is false for examples that import from the docs app itself (not self-contained)', () => {
		const rtlExample = `import { Component } from '@angular/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { TranslateService } from '@spartan-ng/app/app/shared/translate.service';

@Component({ selector: 'x', imports: [HlmAccordionImports], template: '' })
export class RtlExample {}`;
		expect(isRunnableExample(rtlExample)).toBe(false);
	});
});

describe('StackBlitzProjectBuilderService', () => {
	it('includes the generated component libraries verbatim (real folder structure)', () => {
		const { builder } = setup();
		const project = builder.buildProject(EXAMPLE, GENERATED);
		expect(project).not.toBeNull();
		expect(project!.files['libs/ui/button/src/lib/hlm-button.ts']).toBe('export class HlmButton {}');
		expect(project!.files['libs/ui/utils/src/index.ts']).toBeDefined();
		expect(project!.files['components.json']).toBeDefined();
	});

	it('writes tsconfig with the exact generated path aliases', () => {
		const { builder } = setup();
		const tsconfig = JSON.parse(builder.buildProject(EXAMPLE, GENERATED)!.files['tsconfig.json']);
		expect(tsconfig.compilerOptions.paths['@spartan-ng/helm/button']).toEqual(['./libs/ui/button/src/index.ts']);
		expect(tsconfig.compilerOptions.paths['@spartan-ng/helm/utils']).toEqual(['./libs/ui/utils/src/index.ts']);
	});

	it('merges deps, pins Angular from meta, drops vendored helm', () => {
		const { builder } = setup();
		const pkg = JSON.parse(builder.buildProject(EXAMPLE, GENERATED)!.files['package.json']);
		expect(pkg.dependencies['@spartan-ng/brain']).toBe('0.0.1-alpha.702');
		expect(pkg.dependencies['@ng-icons/core']).toBe('>=32.0.0 <34.0.0');
		expect(pkg.dependencies['@angular/core']).toBe('^21.0.0'); // meta pinned wins over loose range
		expect(pkg.dependencies['@angular/cli']).toBe('^21.0.0'); // CLI toolchain present
		expect(Object.keys(pkg.dependencies).some((k) => k.startsWith('@spartan-ng/helm'))).toBe(false);
	});

	it('renders the example via a fixed app-root host using its selector', () => {
		const { builder } = setup();
		const project = builder.buildProject(EXAMPLE, GENERATED)!;
		expect(project.files['src/app/example.ts']).toBe(EXAMPLE);
		expect(project.files['src/app/app.ts']).toContain('<spartan-button-preview />');
		expect(project.files['src/app/app.ts']).toContain("import { ButtonPreview } from './example'");
	});

	it('wraps the @Component class, not a helper class exported before it', () => {
		const { builder } = setup();
		const withHelper = `import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

export class PaymentModel {}

@Component({
	selector: 'spartan-thing-preview',
	imports: [HlmButtonImports],
	template: \`<button hlmBtn>x</button>\`,
})
export class ThingPreview {}`;
		const appTs = builder.buildProject(withHelper, GENERATED)!.files['src/app/app.ts'];
		expect(appTs).toContain("import { ThingPreview } from './example'");
		expect(appTs).toContain('<spartan-thing-preview />');
		expect(appTs).not.toContain('PaymentModel');
	});

	it('returns null for a non-runnable snippet', () => {
		const { builder } = setup();
		expect(builder.buildProject('npm i @spartan-ng/brain', GENERATED)).toBeNull();
	});

	it('bundles sibling files for multi-file examples (transitively) into src/app', () => {
		const { builder } = setup();
		const multiFile = `import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Helper } from './helper';

@Component({ selector: 'x', imports: [HlmButtonImports, Helper], template: '<helper />' })
export class MultiFileExample {}`;
		const generatedWithSiblings: GeneratedProject = {
			...GENERATED,
			exampleFiles: {
				helper: "import { Deep } from './deep';\nexport class Helper {}",
				deep: 'export class Deep {}',
				unused: 'export class Unused {}',
			},
		};
		const project = builder.buildProject(multiFile, generatedWithSiblings)!;
		expect(project.files['src/app/helper.ts']).toContain('export class Helper');
		// transitive sibling is pulled in
		expect(project.files['src/app/deep.ts']).toBe('export class Deep {}');
		// siblings not imported by the example are not written
		expect(project.files['src/app/unused.ts']).toBeUndefined();
	});

	it('returns null when a multi-file example imports a sibling that was not bundled', () => {
		const { builder } = setup();
		const multiFile = `import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Helper } from './helper';

@Component({ selector: 'x', imports: [HlmButtonImports, Helper], template: '<helper />' })
export class MultiFileExample {}`;
		// exampleFiles is empty - the './helper' import cannot be resolved, so the project would be broken.
		expect(builder.buildProject(multiFile, { ...GENERATED, exampleFiles: {} })).toBeNull();
	});

	it('rewrites root-relative /assets paths to the live docs origin (images 404 on StackBlitz otherwise)', () => {
		const { builder } = setup();
		const withImage = `import { Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
	selector: 'spartan-avatar-preview',
	imports: [HlmAvatarImports],
	template: \`<img hlmAvatarImage src="/assets/avatar.png" />\`,
})
export class AvatarPreview {}`;
		const exampleTs = builder.buildProject(withImage, GENERATED)!.files['src/app/example.ts'];
		expect(exampleTs).toContain('src="https://www.spartan.ng/assets/avatar.png"');
		expect(exampleTs).not.toContain('src="/assets/avatar.png"');
	});
});
