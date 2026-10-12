import { promises as fs } from 'node:fs';
import path from 'node:path';
import { registryItemSchema, registrySchema } from '../schema/schema';

export async function validateRegistryFile(registryFile: string, cwd = process.cwd()) {
	const resolved = path.resolve(cwd, registryFile);
	const content = JSON.parse(await fs.readFile(resolved, 'utf-8'));
	const registryResult = registrySchema.safeParse(content);
	if (registryResult.success) {
		return { valid: true, registryFiles: 1, items: registryResult.data.items.length, diagnostics: [] as string[] };
	}

	const itemResult = registryItemSchema.safeParse(content);
	if (itemResult.success) {
		return { valid: true, registryFiles: 1, items: 1, diagnostics: [] as string[] };
	}

	return {
		valid: false,
		registryFiles: 1,
		items: 0,
		diagnostics: [...registryResult.error.issues, ...itemResult.error.issues].map(
			(issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`,
		),
	};
}
