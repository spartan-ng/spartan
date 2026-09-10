import type { Tree } from '@nx/devkit';
import { validateRegistryFile } from '../../registry';
import type { SpartanRegistryValidateSchema } from './schema';

export default async function registryValidateGenerator(_tree: Tree, options: SpartanRegistryValidateSchema) {
	const report = await validateRegistryFile(options.registry ?? './registry.json');
	console.log(JSON.stringify(report, null, 2));
	if (!report.valid) {
		throw new Error('Registry validation failed.');
	}
}
