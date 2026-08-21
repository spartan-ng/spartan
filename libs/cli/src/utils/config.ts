import { readJson, type Tree, updateJson } from '@nx/devkit';

import { prompt } from 'enquirer';
import z, { ZodError } from 'zod';
import { type GenerateAs, generateOptions } from '../generators/base/lib/generate-as';
import { registryConfigSchema } from '../registry';
import { type Style, STYLES } from './supported-styles';

const configPath = 'components.json';

// Default style used when components.json does not set one.
const FALLBACK_STYLE: Style = 'vega';

export const AngularCliConfigSchema = z.object({
	componentsPath: z.string().optional().default('libs/ui'),
	style: z.enum(STYLES).optional().default(FALLBACK_STYLE),
	importAlias: z
		.string()
		.optional()
		.default('@spartan-ng/helm')
		.refine((val) => !val.endsWith('/'), { message: 'importAlias should not end with a slash' }),
	registries: registryConfigSchema.optional(),
});

export const NXConfigSchema = z.object({
	componentsPath: z.string().optional().default('libs/ui'),
	buildable: z.boolean().optional().default(true),
	generateAs: z.enum(generateOptions).optional().default('library'),
	style: z.enum(STYLES).optional().default(FALLBACK_STYLE),
	importAlias: z
		.string()
		.optional()
		.default('@spartan-ng/helm')
		.refine((val) => !val.endsWith('/'), { message: 'importAlias should not end with a slash' }),
	registries: registryConfigSchema.optional(),
});

// buildable and generateAs only exist for NX configs; an Angular CLI config omits them.
export type Config = z.infer<typeof AngularCliConfigSchema> &
	Partial<Pick<z.infer<typeof NXConfigSchema>, 'buildable' | 'generateAs'>>;

const getConfig = async (tree: Tree, isAngularCli: boolean): Promise<Config> => {
	const raw = await readJson(tree, configPath);
	try {
		if (isAngularCli) {
			return AngularCliConfigSchema.parse(raw);
		} else {
			return NXConfigSchema.parse(raw);
		}
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

export async function getImportAlias(tree: Tree, isAngularCli: boolean): Promise<string> {
	// A missing config is expected for a fresh project - fall back to the default alias.
	if (!tree.exists(configPath)) {
		return '@spartan-ng/helm';
	}

	// A present-but-invalid config is a real error: every migration depends on this alias, so let
	// getConfig throw (it prints the offending fields) rather than silently using the wrong one.
	const config = await getConfig(tree, isAngularCli);
	return config.importAlias;
}

// Add the default "style" to components.json when it is missing.
export async function backfillStyleInComponentsJson(tree: Tree): Promise<void> {
	if (!tree.exists(configPath)) return;

	const raw = await readJson(tree, configPath);
	if (raw.style) return;

	updateJson(tree, configPath, (json) => ({ ...json, style: FALLBACK_STYLE }));
	console.log(`No "style" in components.json - added "${FALLBACK_STYLE}".`);
}

export async function loadOrInitConfig(
	tree: Tree,
	defaults?: Partial<Config> & { angularCli: boolean },
): Promise<Config> {
	if (tree.exists(configPath)) {
		return getConfig(tree, defaults?.angularCli ?? false);
	}

	const questions = [
		{
			type: 'input',
			required: true,
			name: 'componentsPath',
			message: 'Choose a directory to place your spartan libraries, e.g. libs/ui',
			initial: defaults?.componentsPath ?? 'libs/ui',
			skip: !!defaults?.componentsPath,
		},
		// Conditionally add NX specific questions
		...(!defaults?.angularCli
			? [
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
				]
			: []),
		{
			type: 'input',
			name: 'importAlias',
			message: 'What import alias should be used for the components?',
			initial: defaults?.importAlias ?? '@spartan-ng/helm',
			skip: !!defaults?.importAlias,
		},
		{
			type: 'select',
			choices: STYLES,
			message: 'Which design system style do you want to use?',
			name: 'style',
			initial: 0,
			skip: !!defaults?.style, // Skip when a style was already provided by the caller.
		},
	];

	console.log('Configuration file not found, creating a new one...');

	const { componentsPath, buildable, generateAs, importAlias, style } = (await prompt(questions)) as {
		componentsPath: string;
		buildable: boolean;
		generateAs: GenerateAs;
		importAlias: string;
		style: Style;
	};

	const config = { componentsPath, buildable, generateAs, importAlias, style };

	tree.write(configPath, JSON.stringify(config, null, 2));

	return config;
}
