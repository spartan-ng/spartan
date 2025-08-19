import { ExecutorContext } from '@nx/devkit';
import fs from 'fs';
import path from 'path';
import { StaticDataFetcherExecutorSchema } from './schema';

async function writeJsonFile(filePath: string, data: any): Promise<void> {
	const outputDir = path.dirname(filePath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}
	await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
}

export default async function runExecutor(options: StaticDataFetcherExecutorSchema, context: ExecutorContext) {
	if (!options.apiUrl) {
		throw new Error('apiUrl is required');
	}

	if (!options.outputFile) {
		throw new Error('outputFile is required');
	}

	try {
		const apiUrl = options.apiUrl;
		const outputFile = options.outputFile;
		const outputPath = path.join(context.root, outputFile);
		const isCritical = options.critical ?? false;

		console.log(`Fetching repository data from: ${apiUrl}`);
		console.log(`Output will be saved to: ${outputPath}`);
		console.log(`Critical mode: ${isCritical}`);

		// Prepare headers for the request
		const headers: Record<string, string> = {
			Accept: 'application/vnd.github.v3+json',
			...options.headers,
		};

		// Make the API request
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			const errorMessage = `Network request failed: ${response.status} ${response.statusText}`;

			if (isCritical) {
				throw new Error(errorMessage);
			} else {
				console.warn(`Warning: ${errorMessage}. Saving empty object due to non-critical mode.`);
				await writeJsonFile(outputPath, {});
				console.log(`Saved empty object to: ${outputPath}`);
				return { success: true, warning: errorMessage };
			}
		}

		const data = await response.json();
		await writeJsonFile(outputPath, data);
		console.log(`Successfully fetched and saved data to: ${outputPath}`);

		return { success: true };
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);

		if (options.critical) {
			console.error('Error fetching data:', error);
			return { success: false, error: errorMessage };
		} else {
			console.warn(`Warning: ${errorMessage}. Saving empty object due to non-critical mode.`);

			try {
				const outputPath = path.join(context.root, options.outputFile!);
				await writeJsonFile(outputPath, {});
				console.log(`Saved empty object to: ${outputPath}`);
				return { success: true, warning: errorMessage };
			} catch (writeError) {
				console.error('Error writing empty object:', writeError);
				return { success: false, error: errorMessage };
			}
		}
	}
}
