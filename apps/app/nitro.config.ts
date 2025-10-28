import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { TSConfigJSON } from 'types-tsconfig';

// Function to find tsconfig.base.json in parent directories
function findTsconfigPath(startDir: string): string {
	let currentDir = startDir;

	while (true) {
		const tsconfigPath = resolve(currentDir, 'tsconfig.base.json');
		if (existsSync(tsconfigPath)) {
			return tsconfigPath;
		}
		const parentDir = dirname(currentDir);
		if (parentDir === currentDir) {
			// Reached the root directory without finding tsconfig.base.json
			throw new Error('tsconfig.base.json not found in parent directories.');
		}
		currentDir = parentDir;
	}
}

// Function to load and parse tsconfig.base.json
function loadTsconfig(tsconfigPath: string): TSConfigJSON {
	const fileContent = readFileSync(tsconfigPath, 'utf8');
	const parsedConfig = JSON.parse(fileContent);

	return parsedConfig;

	// // Validate using isTSConfigJSON
	// if (isTSConfigJSON(configWithoutAngularOptions)) {
	//   return configWithoutAngularOptions;
	// }

	// throw new Error(`Invalid TSConfig format in ${tsconfigPath}`);
}

// Determine the path to tsconfig.base.json
const tsconfigPath = findTsconfigPath(__dirname);

// Load and validate the tsconfig
const tsconfig = loadTsconfig(tsconfigPath);

// Function to generate alias mappings from tsconfig paths
function getAliasesFromTsconfig(tsconfig: TSConfigJSON) {
	const { paths = {} } = tsconfig.compilerOptions || {};
	const aliases: Record<string, string> = {};

	for (const [key, value] of Object.entries(paths)) {
		// Remove trailing '/*' from the key
		const aliasKey = key.replace(/\/\*$/, '');

		// Resolve the first path mapping for the alias
		const pathMapping = String(Array.isArray(value) ? value[0] : value);
		// Remove trailing '/*' from the path mapping
		const aliasPath = pathMapping.replace(/\/\*$/, '');

		// Resolve the absolute path relative to tsconfig.base.json location
		const absolutePath = resolve(dirname(tsconfigPath), aliasPath);

		aliases[aliasKey] = absolutePath;
	}

	return aliases;
}

// Get the aliases
const aliases = getAliasesFromTsconfig(tsconfig);

const compilerOptions = tsconfig.compilerOptions;
// Export the Nitro configuration
export default defineNitroConfig({
	alias: aliases,
	typescript: {
		tsConfig: {
			compilerOptions: {
				...tsconfig.compilerOptions,
			},
		},
	},
	esbuild: {
		options: {
			target: 'esnext',
			tsconfigRaw: {
				compilerOptions: {
					experimentalDecorators: compilerOptions?.experimentalDecorators,
				},
			},
		},
	},
	routeRules: {
		'/api/github-info': { cache: { maxAge: 1000 * 60 * 60 * 24 } },
	},
});
