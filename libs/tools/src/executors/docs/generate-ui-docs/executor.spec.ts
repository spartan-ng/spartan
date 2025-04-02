import { ExecutorContext } from '@nx/devkit';
import * as fs from 'fs';
import { GenerateUiDocsExecutorSchema } from './schema';
import executor from './executor';

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
	getFilePath: jest.fn().mockReturnValue('/root/libs/ui/button/button.component.ts'),
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
					getText: () => name === 'selector' ? "'hlm-button'" : "'hlmButton'",
				}),
			};
		}
	}

	class MockCallExpression {
		constructor(private readonly expression = 'input', private readonly typeArgs = ['boolean']) {}

		getExpression() {
			return {
				getText: () => this.expression,
			};
		}

		getTypeArguments() {
			return this.typeArgs.map(type => ({
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
// **Only used because Test output structure is much more deeply nested than mock directory structure**
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

		// Setup mock context
		context = {
			root: '/root',
			workspace: {
				version: 2,
				projects: {

				},
			},
			isVerbose: false,
			projectsConfigurations: {
				version: 2,
				projects: {},
			},
			nxJsonConfiguration: {},
			cwd: process.cwd(),
			projectGraph: {
				nodes: {},
				dependencies: {},
				externalNodes: {},
			},
		} as ExecutorContext;

		options = {
			outputDir: '/root/dist/extracted-metadata',
			outputFile: 'ui-api.json',
			brainDir: '/root/libs/brain',
			uiDir: '/root/libs/ui',
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
		expect(fs.mkdirSync).toHaveBeenCalledWith(options.outputDir, { recursive: true });
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
				getDecorator: jest.fn().mockReturnValue({ getName: jest.fn().mockReturnValue('Input') }),
				getJsDocs: jest.fn().mockReturnValue([{ getComment: jest.fn().mockReturnValue('Whether the button is disabled') }]),
			},
		]);

		await executor(options, context);

		const writeFileCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
		const receivedJson = JSON.parse(writeFileCall[1]);
		const expectedJson = {
			libs: {
				ui: {
					button: {
						ButtonComponent: {
							file: "../../../../../../../root/libs/ui/button/button.component.ts",
							inputs: [
								{
									name: "disabled",
									type: "boolean",
									description: "Whether the button is disabled"
								}
							],
							outputs: [],
							selector: "hlm-button",
							exportAs: "hlmButton"
						}
					}
				}
			}
		};

		const receivedComponentData = findComponentData(receivedJson, 'ButtonComponent');
		expect(receivedComponentData).toEqual(expectedJson.libs.ui.button.ButtonComponent);
	});

	it('should handle signal-based inputs/outputs', async () => {
		// Setup mock component with signal-based input
		mockClass.getName.mockReturnValue('ButtonComponent');
		mockClass.getDecorator.mockReturnValue(mockDecorator);
		mockDecorator.getName.mockReturnValue('Component');
		mockDecorator.getArguments.mockReturnValue([new MockObjectLiteralExpression()]);
		mockClass.getProperties.mockReturnValue([
			{
				...mockProperty,
				getName: jest.fn().mockReturnValue('disabled'),
				getInitializer: jest.fn().mockReturnValue(new MockCallExpression()),
				getJsDocs: jest.fn().mockReturnValue([{ getComment: jest.fn().mockReturnValue('Whether the button is disabled') }]),
			},
		]);

		await executor(options, context);

		const writeFileCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
		const receivedJson = JSON.parse(writeFileCall[1]);
		const expectedJson = {
			libs: {
				ui: {
					button: {
						ButtonComponent: {
							file: "../../../../../../../root/libs/ui/button/button.component.ts",
							inputs: [
								{
									name: "disabled",
									type: "boolean",
									description: "Whether the button is disabled"
								}
							],
							outputs: [],
							selector: "hlm-button",
							exportAs: "hlmButton"
						}
					}
				}
			}
		};

		const receivedComponentData = findComponentData(receivedJson, 'ButtonComponent');
		expect(receivedComponentData).toEqual(expectedJson.libs.ui.button.ButtonComponent);
	});

	it('should handle nested component structure correctly', async () => {
		// Setup mock component in nested directory
		mockSourceFile.getFilePath.mockReturnValue('/root/libs/ui/button/group/button-group.component.ts');
		mockClass.getName.mockReturnValue('ButtonGroupComponent');
		mockClass.getDecorator.mockReturnValue(mockDecorator);
		mockDecorator.getName.mockReturnValue('Component');
		mockDecorator.getArguments.mockReturnValue([new MockObjectLiteralExpression({
			selector: "'hlm-button-group'",
			exportAs: "'hlmButtonGroup'",
		})]);

		await executor(options, context);

		const writeFileCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
		const receivedJson = JSON.parse(writeFileCall[1]);
		const expectedJson = {
			libs: {
				ui: {
					button: {
						group: {
							ButtonGroupComponent: {
								file: "../../../../../../../root/libs/ui/button/group/button-group.component.ts",
								inputs: [],
								outputs: [],
								selector: "hlm-button-group",
								exportAs: "hlmButtonGroup"
							}
						}
					}
				}
			}
		};

		const receivedComponentData = findComponentData(receivedJson, 'ButtonGroupComponent');
		expect(receivedComponentData).toEqual(expectedJson.libs.ui.button.group.ButtonGroupComponent);
	});

	it('should handle brain components correctly', async () => {
		// Setup mock brain component
		mockSourceFile.getFilePath.mockReturnValue('/root/libs/brain/button/button.component.ts');
		mockClass.getName.mockReturnValue('ButtonComponent');
		mockClass.getDecorator.mockReturnValue(mockDecorator);
		mockDecorator.getName.mockReturnValue('Component');
		mockDecorator.getArguments.mockReturnValue([new MockObjectLiteralExpression({
			selector: "'brn-button'",
			exportAs: "'brnButton'",
		})]);

		await executor(options, context);

		const writeFileCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
		const receivedJson = JSON.parse(writeFileCall[1]);
		const expectedJson = {
			libs: {
				brain: {
					button: {
						ButtonComponent: {
							file: "../../../../../../../root/libs/brain/button/button.component.ts",
							inputs: [],
							outputs: [],
							selector: "brn-button",
							exportAs: "brnButton"
						}
					}
				}
			}
		};

		const receivedComponentData = findComponentData(receivedJson, 'ButtonComponent');
		expect(receivedComponentData).toEqual(expectedJson.libs.brain.button.ButtonComponent);
	});
});
