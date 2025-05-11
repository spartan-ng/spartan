import { ExecutorContext } from '@nx/devkit';
import * as fs from 'fs';
import executor from './executor';
import { GenerateUiDocsExecutorSchema } from './schema';

// Mock the entire fs module
jest.mock('fs', () => ({
	existsSync: jest.fn().mockReturnValue(false),
	mkdirSync: jest.fn(),
	promises: {
		writeFile: jest.fn().mockResolvedValue(undefined),
	},
}));

// Mock source file
const mockSourceFile = {
	getClasses: jest.fn(),
	getFilePath: jest.fn().mockReturnValue('/workspace/libs/ui/button/button.component.ts'),
};

// Mock ts-morph
jest.mock('ts-morph', () => {
	class MockObjectLiteralExpression {
		constructor(private readonly properties = {}) {}

		getProperty(name: string) {
			if (this.properties[name]) {
				return {
					getInitializer: () => ({
						getText: () => this.properties[name],
					}),
				};
			}
			return {
				getInitializer: () => ({
					getText: () => (name === 'selector' ? "'hlm-button'" : "'hlmButton'"),
				}),
			};
		}
	}

	class MockCallExpression {
		constructor(
			private readonly expression = 'input',
			private readonly typeArgs = ['boolean'],
		) {}

		getExpression() {
			return {
				getText: () => this.expression,
			};
		}

		getTypeArguments() {
			return this.typeArgs.map((type) => ({
				getText: () => type,
			}));
		}
	}

	return {
		Project: jest.fn().mockImplementation(() => ({
			addSourceFilesAtPaths: jest.fn(),
			getSourceFiles: jest.fn().mockReturnValue([mockSourceFile]),
		})),
		ObjectLiteralExpression: MockObjectLiteralExpression,
		CallExpression: MockCallExpression,
	};
});

// Helper function to find component data in nested JSON structure
const findComponentData = (obj: any, componentName: string): any => {
	if (obj[componentName]) {
		return obj[componentName];
	}
	for (const key in obj) {
		if (typeof obj[key] === 'object') {
			const result = findComponentData(obj[key], componentName);
			if (result) return result;
		}
	}
	return null;
};

describe('GenerateUiDocs Executor', () => {
	let context: ExecutorContext;
	let options: GenerateUiDocsExecutorSchema;

	let mockClass: any;
	let mockDecorator: any;
	let mockProperty: any;
	let MockObjectLiteralExpression: any;
	let MockCallExpression: any;

	beforeEach(() => {
		// Get mock classes from the mock module
		const tsMorph = jest.requireMock('ts-morph');
		MockObjectLiteralExpression = tsMorph.ObjectLiteralExpression;
		MockCallExpression = tsMorph.CallExpression;

		// Setup mock context with a realistic workspace root
		context = {
			root: '/workspace',
			workspace: {
				version: 2,
				npmScope: 'spartan-ng',
				projects: {
					app: {
						root: 'apps/app',
						projectType: 'application',
						targets: {
							build: {
								executor: '@analogjs/platform:vite',
								options: {
									outputPath: 'dist/apps/app',
								},
							},
						},
					},
				},
			},
			projectName: 'app',
			targetName: 'generate-ui-docs',
			configurationName: 'production',
			isVerbose: false,
			cwd: '/workspace',
			projectsConfigurations: {
				version: 2,
				projects: {
					app: {
						root: 'apps/app',
						projectType: 'application',
						targets: {
							build: {
								executor: '@analogjs/platform:vite',
								options: {
									outputPath: 'dist/apps/app',
								},
							},
						},
					},
				},
			},
			nxJsonConfiguration: {
				npmScope: 'spartan-ng',
				tasksRunnerOptions: {
					default: {
						runner: 'nx/tasks-runners/default',
						options: {
							cacheableOperations: ['build', 'lint', 'test', 'e2e'],
						},
					},
				},
				targetDefaults: {
					build: {
						dependsOn: ['^build'],
					},
				},
			},
			projectGraph: {
				nodes: {},
				dependencies: {},
				externalNodes: {},
			},
		} as ExecutorContext;

		// Setup options with relative paths
		options = {
			outputDir: 'dist/extracted-metadata',
			outputFile: 'ui-api.json',
			brainDir: 'libs/brain',
			uiDir: 'libs/ui',
		};

		// Setup mock classes and decorators
		mockClass = {
			getName: jest.fn(),
			getDecorator: jest.fn(),
			getProperties: jest.fn().mockReturnValue([]),
		};
		mockDecorator = {
			getName: jest.fn(),
			getArguments: jest.fn(),
		};
		mockProperty = {
			getType: jest.fn().mockReturnValue({ getText: () => 'boolean' }),
			getDecorator: jest.fn(),
			getName: jest.fn(),
			getJsDocs: jest.fn().mockReturnValue([]),
			getInitializer: jest.fn(),
		};

		// Reset mock implementations
		mockSourceFile.getClasses.mockReturnValue([mockClass]);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create output directory if it does not exist', async () => {
		await executor(options, context);
		expect(fs.mkdirSync).toHaveBeenCalledWith('/workspace/dist/extracted-metadata', { recursive: true });
	});

	it('should extract component metadata correctly', async () => {
		// Setup mock component
		mockClass.getName.mockReturnValue('ButtonComponent');
		mockClass.getDecorator.mockReturnValue(mockDecorator);
		mockDecorator.getName.mockReturnValue('Component');
		mockDecorator.getArguments.mockReturnValue([new MockObjectLiteralExpression()]);
		mockClass.getProperties.mockReturnValue([
			{
				...mockProperty,
				getName: jest.fn().mockReturnValue('disabled'),
				getType: jest.fn().mockReturnValue({ getText: () => 'boolean' }),
				getDecorator: jest.fn().mockReturnValue({
					getName: jest.fn().mockReturnValue('Input'),
					getArguments: jest.fn().mockReturnValue([{ getText: () => '(false)' }]),
				}),
				getJsDocs: jest
					.fn()
					.mockReturnValue([{ getComment: jest.fn().mockReturnValue('Whether the button is disabled') }]),
			},
		]);

		await executor(options, context);

		const writeFileCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
		const receivedJson = JSON.parse(writeFileCall[1]);
		const expectedJson = {
			button: {
				ui: {
					ButtonComponent: {
						file: 'libs/ui/button/button.component.ts',
						inputs: [
							{
								name: 'disabled',
								type: 'boolean',
								description: 'Whether the button is disabled',
								defaultValue: 'false',
							},
						],
						outputs: [],
						selector: 'hlm-button',
						exportAs: 'hlmButton',
					},
				},
			},
		};

		const receivedComponentData = findComponentData(receivedJson, 'ButtonComponent');
		expect(receivedComponentData).toEqual(expectedJson.button.ui.ButtonComponent);
	});

	it('should handle signal-based inputs/outputs with default values', async () => {
		// Setup mock component with signal-based input
		mockClass.getName.mockReturnValue('ButtonComponent');
		mockClass.getDecorator.mockReturnValue(mockDecorator);
		mockDecorator.getName.mockReturnValue('Component');
		mockDecorator.getArguments.mockReturnValue([new MockObjectLiteralExpression()]);
		mockClass.getProperties.mockReturnValue([
			{
				...mockProperty,
				getName: jest.fn().mockReturnValue('disabled'),
				getInitializer: jest.fn().mockReturnValue(new MockCallExpression('input', ['boolean'])),
				getJsDocs: jest
					.fn()
					.mockReturnValue([{ getComment: jest.fn().mockReturnValue('Whether the button is disabled') }]),
			},
		]);

		// Mock the CallExpression to include arguments with default values
		const mockCallExpression = jest.requireMock('ts-morph').CallExpression;
		mockCallExpression.prototype.getArguments = jest.fn().mockReturnValue([{ getText: () => '(false)' }]);

		await executor(options, context);

		const writeFileCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
		const receivedJson = JSON.parse(writeFileCall[1]);
		const expectedJson = {
			button: {
				ui: {
					ButtonComponent: {
						file: 'libs/ui/button/button.component.ts',
						inputs: [
							{
								name: 'disabled',
								type: 'boolean',
								description: 'Whether the button is disabled',
								defaultValue: 'false',
							},
						],
						outputs: [],
						selector: 'hlm-button',
						exportAs: 'hlmButton',
					},
				},
			},
		};

		const receivedComponentData = findComponentData(receivedJson, 'ButtonComponent');
		expect(receivedComponentData).toEqual(expectedJson.button.ui.ButtonComponent);
	});

	it('should handle nested component structure correctly', async () => {
		// Setup mock component in nested directory
		mockSourceFile.getFilePath.mockReturnValue('/workspace/libs/ui/button/group/button-group.component.ts');
		mockClass.getName.mockReturnValue('ButtonGroupComponent');
		mockClass.getDecorator.mockReturnValue(mockDecorator);
		mockDecorator.getName.mockReturnValue('Component');
		mockDecorator.getArguments.mockReturnValue([
			new MockObjectLiteralExpression({
				selector: "'hlm-button-group'",
				exportAs: "'hlmButtonGroup'",
			}),
		]);

		await executor(options, context);

		const writeFileCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
		const receivedJson = JSON.parse(writeFileCall[1]);
		const expectedJson = {
			button: {
				ui: {
					ButtonGroupComponent: {
						file: 'libs/ui/button/group/button-group.component.ts',
						inputs: [],
						outputs: [],
						selector: 'hlm-button-group',
						exportAs: 'hlmButtonGroup',
					},
				},
			},
		};

		const receivedComponentData = findComponentData(receivedJson, 'ButtonGroupComponent');
		expect(receivedComponentData).toEqual(expectedJson.button.ui.ButtonGroupComponent);
	});

	it('should handle brain components correctly', async () => {
		// Setup mock brain component
		mockSourceFile.getFilePath.mockReturnValue('/workspace/libs/brain/button/button.component.ts');
		mockClass.getName.mockReturnValue('ButtonComponent');
		mockClass.getDecorator.mockReturnValue(mockDecorator);
		mockDecorator.getName.mockReturnValue('Component');
		mockDecorator.getArguments.mockReturnValue([
			new MockObjectLiteralExpression({
				selector: "'brn-button'",
				exportAs: "'brnButton'",
			}),
		]);

		await executor(options, context);

		const writeFileCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
		const receivedJson = JSON.parse(writeFileCall[1]);
		const expectedJson = {
			button: {
				brain: {
					ButtonComponent: {
						file: 'libs/brain/button/button.component.ts',
						inputs: [],
						outputs: [],
						selector: 'brn-button',
						exportAs: 'brnButton',
					},
				},
			},
		};

		const receivedComponentData = findComponentData(receivedJson, 'ButtonComponent');
		expect(receivedComponentData).toEqual(expectedJson.button.brain.ButtonComponent);
	});

	it('should extract model properties and include them in the output', async () => {
		// Setup mock component with a model property
		mockClass.getName.mockReturnValue('OtpComponent');
		mockClass.getDecorator.mockReturnValue(mockDecorator);
		mockDecorator.getName.mockReturnValue('Component');
		mockDecorator.getArguments.mockReturnValue([new MockObjectLiteralExpression()]);
		mockClass.getProperties.mockReturnValue([
			{
				...mockProperty,
				getName: jest.fn().mockReturnValue('value'),
				getInitializer: jest.fn().mockReturnValue(new MockCallExpression('model', ['string'])),
				getJsDocs: jest
					.fn()
					.mockReturnValue([{ getComment: jest.fn().mockReturnValue('The value controlling the input') }]),
			},
		]);

		// Mock the CallExpression to include arguments with default values
		const mockCallExpression = jest.requireMock('ts-morph').CallExpression;
		mockCallExpression.prototype.getArguments = jest.fn().mockReturnValue([{ getText: () => "('')" }]);

		await executor(options, context);

		const writeFileCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
		const receivedJson = JSON.parse(writeFileCall[1]);
		const receivedComponentData = findComponentData(receivedJson, 'OtpComponent');
		expect(receivedComponentData.models).toEqual([
			{
				name: 'value',
				type: 'string',
				description: 'The value controlling the input',
				defaultValue: '',
			},
		]);
	});

	it('should use alias as input name if present in input options', async () => {
		// Setup mock component with a signal-based input with alias
		mockClass.getName.mockReturnValue('AliasComponent');
		mockClass.getDecorator.mockReturnValue(mockDecorator);
		mockDecorator.getName.mockReturnValue('Component');
		mockDecorator.getArguments.mockReturnValue([new MockObjectLiteralExpression()]);
		const mockObjectLiteral = new MockObjectLiteralExpression({ alias: "'class'" });
		const mockCallExpr = new MockCallExpression('input', ['ClassValue']);
		mockCallExpr.getArguments = jest.fn().mockReturnValue([{ getText: () => "('')" }, mockObjectLiteral]);
		mockClass.getProperties.mockReturnValue([
			{
				...mockProperty,
				getName: jest.fn().mockReturnValue('userClass'),
				getInitializer: jest.fn().mockReturnValue(mockCallExpr),
				getJsDocs: jest.fn().mockReturnValue([{ getComment: jest.fn().mockReturnValue('User class input') }]),
			},
		]);

		await executor(options, context);

		const writeFileCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
		const receivedJson = JSON.parse(writeFileCall[1]);
		const receivedComponentData = findComponentData(receivedJson, 'AliasComponent');
		expect(receivedComponentData.inputs).toEqual([
			{
				name: 'class', // alias should be used
				type: 'ClassValue',
				description: 'User class input',
				defaultValue: '',
			},
		]);
	});
});
