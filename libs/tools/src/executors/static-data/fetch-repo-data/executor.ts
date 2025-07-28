import { ExecutorContext } from '@nx/devkit';
import fs from 'fs';
import path from 'path';
import { FetchStaticDataExecutorSchema } from './schema';

export default async function runExecutor(options: FetchStaticDataExecutorSchema, context: ExecutorContext) {
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

		console.log(`Fetching repository data from: ${apiUrl}`);
		console.log(`Output will be saved to: ${outputPath}`);

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
			throw new Error(`Network request failed: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		// Ensure the output directory exists
		const outputDir = path.dirname(outputPath);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Write the data to the output file
		await fs.promises.writeFile(outputPath, JSON.stringify(data, null, 2));

		console.log(`Successfully fetched and saved data to: ${outputPath}`);

		return { success: true };
	} catch (error) {
		console.error('Error fetching data:', error);
		return { success: false, error: error instanceof Error ? error.message : String(error) };
	}
}
