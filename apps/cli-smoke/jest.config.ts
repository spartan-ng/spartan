export default {
	displayName: 'cli-smoke',
	preset: '../../jest.preset.cjs',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	// Each matrix cell scaffolds a workspace, installs dependencies and runs a real build, so the
	// suite is slow and must not run in parallel (a single local registry is shared).
	maxWorkers: 1,
	testTimeout: 900_000,
	globalSetup: '<rootDir>/src/support/global-setup.ts',
	globalTeardown: '<rootDir>/src/support/global-teardown.ts',
	coverageDirectory: '../../coverage/apps/cli-smoke',
};
