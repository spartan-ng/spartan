import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateInputOtpGenerator } from './generator';

vi.mock('enquirer');
vi.mock('@nx/devkit', async (importOriginal) => {
	const original = await importOriginal<typeof import('@nx/devkit')>();
	return {
		...original,
		ensurePackage: (pkg: string) => require(pkg),
		createProjectGraphAsync: vi.fn().mockResolvedValue({
			nodes: {},
			dependencies: {},
		}),
	};
});

describe('migrate-input-otp generator', () => {
	let tree: Tree;

	beforeEach(async () => {
		tree = createTreeWithEmptyWorkspace();

		await applicationGenerator(tree, {
			name: 'app',
			directory: 'app',
			skipFormat: true,
			e2eTestRunner: E2eTestRunner.None,
			unitTestRunner: UnitTestRunner.None,
			skipPackageJson: true,
			skipTests: true,
		});
	});

	it('should migrate helm input otp elements', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
			import { HlmInputOtp, HlmInputOtpSlot } from '@spartan-ng/helm/input-otp';

			@Component({
				imports: [BrnInputOtp, HlmInputOtp, HlmInputOtpSlot],
				template: \`
					<brn-input-otp hlmInputOtp length="6">
						<hlm-input-otp-slot index="0" />
					</brn-input-otp>
				\`
			})
			export class AppComponent {}
			`,
		);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('<hlm-input-otp length="6">');
		expect(content).toContain('</hlm-input-otp>');
		expect(content).not.toContain('brn-input-otp');
		expect(content).not.toContain('hlmInputOtp');
	});

	it('should add the hidden input directive to brain input otp elements', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import { BrnInputOtp, BrnInputOtpSlot } from '@spartan-ng/brain/input-otp';

			@Component({
				imports: [BrnInputOtp, BrnInputOtpSlot],
				template: \`
					<brn-input-otp length="6">
						<brn-input-otp-slot index="0" />
					</brn-input-otp>
				\`
			})
			export class AppComponent {}
			`,
		);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('<brn-input-otp length="6">');
		expect(content).toContain('<input brnInputOtpInput />');
		expect(content).toContain('BrnInputOtpInput');
		expect(content).toContain('imports: [BrnInputOtp, BrnInputOtpSlot, BrnInputOtpInput]');
	});

	it('should not add the hidden input twice', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
			<brn-input-otp length="6">
				<brn-input-otp-slot index="0" />
				<input brnInputOtpInput />
			</brn-input-otp>
			`,
		);

		await migrateInputOtpGenerator(tree, { skipFormat: true });
		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content.match(/brnInputOtpInput/g)).toHaveLength(1);
	});

	it('should migrate self-closing helm input otp elements', async () => {
		tree.write('app/src/app/app.component.html', `<brn-input-otp hlmInputOtp length="6" />`);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('<hlm-input-otp length="6" />');
		expect(content).not.toContain('brn-input-otp');
	});

	it('should move input-specific attributes to the hidden input directive', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
			<brn-input-otp
				length="6"
				inputClass="custom-input-class"
				[inputStyles]="styles"
				[inputMode]="'text'"
				[inputAutocomplete]="'off'"
			>
				<brn-input-otp-slot index="0" />
			</brn-input-otp>
			`,
		);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('<brn-input-otp length="6">');
		expect(content).not.toContain('inputClass=');
		expect(content).not.toContain('[inputAutocomplete]');
		expect(content).toContain(
			'<input brnInputOtpInput class="custom-input-class" [inputStyles]="styles" [inputMode]="\'text\'" [autocomplete]="\'off\'" />',
		);
	});

	it('should preserve static classes when moving an inputClass binding', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
			<brn-input-otp length="6" [inputClass]="classes">
				<input brnInputOtpInput class="custom" />
			</brn-input-otp>
			`,
		);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('class="custom"');
		expect(content).toContain('[class]="classes"');
		expect(content).not.toContain('[inputClass]');
	});

	it('should not treat quoted values as helm usage', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
			<brn-input-otp length="6" inputClass="hlm-input">
				<brn-input-otp-slot index="0" />
			</brn-input-otp>
			`,
		);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('<brn-input-otp length="6">');
		expect(content).not.toContain('<hlm-input-otp');
		expect(content).toContain('<input brnInputOtpInput class="hlm-input" />');
	});

	it('should parse quoted attribute values containing >', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
			<brn-input-otp length="6" [disabled]="attempts > 3" inputClass="custom">
				<brn-input-otp-slot index="0" />
			</brn-input-otp>
			`,
		);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('<brn-input-otp length="6" [disabled]="attempts > 3">');
		expect(content).toContain('<input brnInputOtpInput class="custom" />');
	});

	it('should add the input import without creating a double comma', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import {
				BrnInputOtp,
				BrnInputOtpSlot,
			} from '@spartan-ng/brain/input-otp';

			@Component({
				imports: [BrnInputOtp, BrnInputOtpSlot],
				template: \`
					<brn-input-otp length="6">
						<brn-input-otp-slot index="0" />
					</brn-input-otp>
				\`
			})
			export class AppComponent {}
			`,
		);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(',,');
		expect(content).toContain('BrnInputOtpInput');
	});

	it('should support namespace imports', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import * as BrnOtp from '@spartan-ng/brain/input-otp';

			@Component({
				imports: [BrnOtp.BrnInputOtp, BrnOtp.BrnInputOtpSlot],
				template: \`
					<brn-input-otp length="6">
						<brn-input-otp-slot index="0" />
					</brn-input-otp>
				\`
			})
			export class AppComponent {}
			`,
		);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain("import { BrnInputOtpInput } from '@spartan-ng/brain/input-otp';");
		expect(content).toContain('BrnOtp.BrnInputOtp, BrnOtp.BrnInputOtpSlot, BrnInputOtpInput');
	});

	it('should support aliased imports', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import {
				BrnInputOtp as InputOtp,
				BrnInputOtpSlot as InputOtpSlot,
			} from '@spartan-ng/brain/input-otp';

			@Component({
				imports: [InputOtp, InputOtpSlot],
				template: \`
					<brn-input-otp length="6">
						<brn-input-otp-slot index="0" />
					</brn-input-otp>
				\`
			})
			export class AppComponent {}
			`,
		);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('BrnInputOtpInput');
		expect(content).toContain('imports: [InputOtp, InputOtpSlot, BrnInputOtpInput]');
	});

	it('should update the owning component imports for external templates', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import { BrnInputOtp, BrnInputOtpSlot } from '@spartan-ng/brain/input-otp';

			@Component({
				imports: [BrnInputOtp, BrnInputOtpSlot],
				templateUrl: './app.component.html',
			})
			export class AppComponent {}
			`,
		);
		tree.write(
			'app/src/app/app.component.html',
			`
			<brn-input-otp length="6">
				<brn-input-otp-slot index="0" />
			</brn-input-otp>
			`,
		);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const template = tree.read('app/src/app/app.component.html', 'utf-8');
		const component = tree.read('app/src/app/app.component.ts', 'utf-8');

		expect(template).toContain('<input brnInputOtpInput />');
		expect(component).toContain('imports: [BrnInputOtp, BrnInputOtpSlot, BrnInputOtpInput]');
		expect(component).toContain('BrnInputOtpInput');
	});

	it('should leave containerStyles usage for the healthcheck to report', async () => {
		const template = `
			<brn-input-otp length="6" [containerStyles]="containerStyles">
				<brn-input-otp-slot index="0" />
			</brn-input-otp>
		`;

		tree.write('app/src/app/app.component.html', template);

		await migrateInputOtpGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('[containerStyles]="containerStyles"');
		expect(content).not.toContain('<input brnInputOtpInput');
	});
});
