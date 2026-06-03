export default {
	displayName: 'tools',
	preset: '../../jest.preset.cjs',
	setupFiles: ['<rootDir>/src/test-setup.ts'],
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../coverage/libs/tools',
};
