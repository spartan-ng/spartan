import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { prompt } from 'enquirer';
import { loadOrInitConfig } from '../../utils/config';
import hlmUIGenerator from './generator';

vi.mock('enquirer', () => ({
	prompt: vi.fn(),
}));
vi.mock('../../utils/config', async (importOriginal) => {
	const original = await importOriginal<typeof import('../../utils/config')>();
	return {
		...original,
		backfillStyleInComponentsJson: vi.fn().mockResolvedValue(undefined),
		loadOrInitConfig: vi.fn().mockResolvedValue({
			componentsPath: 'libs/ui',
			buildable: true,
			generateAs: 'library',
			importAlias: '@spartan-ng/helm',
			style: 'vega',
		}),
	};
});
vi.mock('./add-dependent-primitive', () => ({
	addDependentPrimitives: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('./libs/button/generator', () => ({
	generator: vi.fn().mockResolvedValue(undefined),
}));

describe('ui generator', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
		vi.mocked(prompt).mockResolvedValue({ primitives: ['button'] } as never);
	});

	it('loads config as an Nx workspace when not run via the Angular CLI', async () => {
		await hlmUIGenerator(tree, {});

		expect(loadOrInitConfig).toHaveBeenCalledWith(tree, {
			componentsPath: undefined,
			angularCli: false,
		});
	});

	it('loads config as an Angular CLI workspace when the compat wrapper passes angularCli', async () => {
		await hlmUIGenerator(tree, { angularCli: true });

		expect(loadOrInitConfig).toHaveBeenCalledWith(tree, {
			componentsPath: undefined,
			angularCli: true,
		});
	});
});
