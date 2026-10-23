import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import type { HealthcheckFailureFn } from '../healthchecks';
import { HealthcheckSeverity } from '../healthchecks';
import { inputOtpHealthcheck } from './hlm-input-otp';

describe('input-otp healthcheck', () => {
	let tree: Tree;
	let failures: Array<{ message: string; severity: HealthcheckSeverity; fixable: boolean }>;

	const detect = () =>
		inputOtpHealthcheck.detect(
			tree,
			((message, severity, fixable) => failures.push({ message, severity, fixable })) as HealthcheckFailureFn,
			() => undefined,
			{ importAlias: '@spartan-ng/helm' },
		);

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
		failures = [];
	});

	it('does not report already-migrated brain usage', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
			<brn-input-otp length="6">
				<brn-input-otp-slot index="0" />
				<input brnInputOtpInput />
			</brn-input-otp>
			`,
		);

		await detect();

		expect(failures).toHaveLength(0);
	});

	it('reports brain usage that is missing the input directive', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
			<brn-input-otp length="6">
				<brn-input-otp-slot index="0" />
			</brn-input-otp>
			`,
		);

		await detect();

		expect(failures).toEqual([
			{
				message:
					'Brain <brn-input-otp> usage is missing <input brnInputOtpInput /> or still has input-specific attributes on the root.',
				severity: HealthcheckSeverity.Error,
				fixable: true,
			},
		]);
	});

	it('reports legacy helm usage as fixable', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
			<brn-input-otp hlmInputOtp length="6">
				<hlm-input-otp-slot index="0" />
			</brn-input-otp>
			`,
		);

		await detect();

		expect(failures).toEqual([
			{
				message: 'Legacy <brn-input-otp hlmInputOtp> usage found. Use <hlm-input-otp> instead.',
				severity: HealthcheckSeverity.Error,
				fixable: true,
			},
		]);
	});

	it('reports containerStyles as non-fixable', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
			<brn-input-otp length="6" [containerStyles]="styles">
				<brn-input-otp-slot index="0" />
			</brn-input-otp>
			`,
		);

		await detect();

		expect(failures).toEqual([
			{
				message:
					'The containerStyles input was removed. Move custom container styles to the host or input before migrating input-otp.',
				severity: HealthcheckSeverity.Error,
				fixable: false,
			},
		]);
	});

	it('reports containerStyles on the hlm root as non-fixable', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
			<hlm-input-otp length="6" [containerStyles]="styles">
				<hlm-input-otp-slot index="0" />
			</hlm-input-otp>
			`,
		);

		await detect();

		expect(failures).toEqual([
			{
				message:
					'The containerStyles input was removed. Move custom container styles to the host or input before migrating input-otp.',
				severity: HealthcheckSeverity.Error,
				fixable: false,
			},
		]);
	});

	it('clears the report after fixing brain usage', async () => {
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

		await detect();
		expect(failures.length).toBeGreaterThan(0);

		await inputOtpHealthcheck.fix(tree, { importAlias: '@spartan-ng/helm' });

		failures = [];
		await detect();
		expect(failures).toHaveLength(0);
	});
});
