import { type Tree, readJson } from '@nx/devkit';
import { prompt } from 'enquirer';
import z, { ZodError } from 'zod';
import { type GenerateAs, generateOptions } from '../generators/base/lib/generate-as';

const configPath = 'components.json';

export const ConfigSchema = z.object({
	componentsPath: z.string().optional().default('libs/ui'),
	buildable: z.boolean().optional().default(true),
	generateAs: z.enum(generateOptions).optional().default('library'),
	importAlias: z
		.string()
		.optional()
		.default('@spartan-ng/helm')
		.refine((val) => !val.endsWith('/'), { message: 'importAlias should not end with a slash' }),
});

export type Config = z.infer<typeof ConfigSchema>;

const getConfig = async (tree: Tree): Promise<Config> => {
	const raw = await readJson(tree, configPath);
	try {
		return ConfigSchema.parse(raw);
	} catch (e) {
		if (e instanceof ZodError) {
			const rows = e.issues.map((issue) => {
				let expected: string | undefined;

				if ('expected' in issue) {
					expected = String(issue.expected);
				} else if ('options' in issue) {
					expected = issue.options.join(' | ');
				}

				return {
					path: issue.path.join('.') || 'root',
					message: issue.message,
					expected: expected ?? '-',
				};
			});

			console.table(rows, ['path', 'expected', 'message']);
			throw new Error('Config validation failed. Please fix the issues above.');
		} else {
			throw e;
		}
	}
};

export async function getOrCreateConfig(tree: Tree, defaults?: Partial<Config>): Promise<Config> {
	if (tree.exists(configPath)) {
		return getConfig(tree);
	}

	console.log('Configuration file not found, creating a new one...');

	const { componentsPath, buildable, generateAs, importAlias } = (await prompt([
		{
			type: 'input',
			required: true,
			name: 'componentsPath',
			message: 'Choose a directory to place your spartan libraries, e.g. libs/ui',
			initial: defaults?.componentsPath ?? 'libs/ui',
			skip: !!defaults?.componentsPath,
		},
		{
			type: 'confirm',
			name: 'buildable',
			message: 'Should the libraries be buildable?',
			initial: defaults?.buildable ?? true,
			skip: typeof defaults?.buildable === 'boolean',
		},
		{
			type: 'select',
			choices: ['library', 'entrypoint'],
			name: 'generateAs',
			message: 'How should we generate the components?',
			initial: 0,
			skip: typeof defaults?.generateAs === 'string',
		},
		{
			type: 'input',
			name: 'importAlias',
			message: 'What import alias should be used for the components?',
			initial: defaults?.importAlias ?? '@spartan-ng/helm',
			skip: !!defaults?.importAlias,
		},
	])) as { componentsPath: string; buildable: boolean; generateAs: GenerateAs; importAlias: string };

	const config = { componentsPath, buildable, generateAs, importAlias };

	tree.write(configPath, JSON.stringify(config, null, 2));

	return config;
}
