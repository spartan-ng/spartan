export default {
	displayName: 'mcp',
	preset: '../../jest.preset.cjs',
	testEnvironment: 'node',
	transform: {
		// isolatedModules transpiles each file independently, so ESM-style `.js`
		// import specifiers don't need type-level resolution under commonjs.
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json', isolatedModules: true }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	// Source files use ESM-style `.js` import specifiers (NodeNext); strip the
	// extension so ts-jest (commonjs) resolves them to the `.ts` sources.
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	coverageDirectory: '../../coverage/libs/mcp',
};
