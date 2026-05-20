import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { APIInfo, CodeBlock } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

interface CacheMetadata {
	version: string;
	createdAt: string;
	lastUpdated: string;
	components: Record<string, { cachedAt: string; size: number }>;
	docs: Record<string, { cachedAt: string; size: number }>;
	blocks?: Record<string, { cachedAt: string; size: number }>;
}

interface ComponentFullData {
	html: string;
	api: APIInfo;
	examples: CodeBlock[];
	url: string;
}

interface ComponentCacheEntry {
	componentName: string;
	version: string;
	cachedAt: string;
	html: string;
	api: APIInfo;
	examples: CodeBlock[];
	full: ComponentFullData;
}

interface DocsCacheEntry {
	topic: string;
	content: string;
	version: string;
	cachedAt: string;
}

interface BlockCacheEntry {
	blockName: string;
	version: string;
	cachedAt: string;
	html: string;
	code: CodeBlock[];
	full: { html: string; code: CodeBlock[]; url: string };
}

interface CacheResult<T> {
	data: T | null;
	cached: boolean;
	stale: boolean;
	cachedAt: string | null;
	version: string | null;
}

interface ClearResult {
	success: boolean;
	message: string;
	version?: string;
	versions?: string[];
}

interface StatsResult {
	currentVersion: string | null;
	totalVersions: number;
	versions: Array<{
		version: string;
		componentCount: number;
		docsCount: number;
		blockCount: number;
		createdAt: string;
		lastUpdated: string;
		isCurrent: boolean;
	}>;
	error?: string;
}

interface VersionInfo {
	version: string;
	path: string;
	isCurrent: boolean;
}

/**
 * Version-aware cache manager for Spartan UI documentation
 * Stores cached data in cache/{version}/ directory structure
 */
export class CacheManager {
	cacheDir: string;
	currentVersion: string | null;
	cacheMetadata: CacheMetadata | null;

	constructor() {
		this.cacheDir = path.join(PROJECT_ROOT, 'cache');
		this.currentVersion = null;
		this.cacheMetadata = null;
	}

	async initialize(spartanVersion?: string): Promise<string> {
		this.currentVersion = spartanVersion || 'latest';
		await this.ensureCacheDir();
		await this.loadMetadata();
		return this.currentVersion;
	}

	async ensureCacheDir(): Promise<void> {
		const versionDir = path.join(this.cacheDir, this.currentVersion!);
		const componentsDir = path.join(versionDir, 'components');
		const docsDir = path.join(versionDir, 'docs');
		const blocksDir = path.join(versionDir, 'blocks');

		await fs.mkdir(componentsDir, { recursive: true });
		await fs.mkdir(docsDir, { recursive: true });
		await fs.mkdir(blocksDir, { recursive: true });
	}

	async loadMetadata(): Promise<void> {
		const metadataPath = path.join(this.cacheDir, this.currentVersion!, 'metadata.json');

		try {
			const data = await fs.readFile(metadataPath, 'utf-8');
			this.cacheMetadata = JSON.parse(data);
		} catch {
			this.cacheMetadata = {
				version: this.currentVersion!,
				createdAt: new Date().toISOString(),
				lastUpdated: new Date().toISOString(),
				components: {},
				docs: {},
				blocks: {},
			};
			await this.saveMetadata();
		}
	}

	async saveMetadata(): Promise<void> {
		const metadataPath = path.join(this.cacheDir, this.currentVersion!, 'metadata.json');
		await fs.writeFile(metadataPath, JSON.stringify(this.cacheMetadata, null, 2), 'utf-8');
	}

	async getComponent(
		componentName: string,
		dataType = 'full',
	): Promise<CacheResult<ComponentCacheEntry | ComponentFullData | string | APIInfo | CodeBlock[] | string[]>> {
		const componentFile = path.join(this.cacheDir, this.currentVersion!, 'components', `${componentName}.json`);

		try {
			const data = await fs.readFile(componentFile, 'utf-8');
			const componentData = JSON.parse(data) as ComponentCacheEntry;

			const ttlHours = Number(process.env.SPARTAN_CACHE_TTL_HOURS || 24);
			const cacheAge = Date.now() - new Date(componentData.cachedAt).getTime();
			const isStale = cacheAge > ttlHours * 60 * 60 * 1000;

			let selectedData: ComponentCacheEntry | ComponentFullData | string | APIInfo | CodeBlock[] | string[];
			switch (dataType) {
				case 'html':
					selectedData = componentData.html;
					break;
				case 'api':
					selectedData = componentData.api;
					break;
				case 'examples':
					selectedData = componentData.examples;
					break;
				case 'full':
				default:
					selectedData = componentData.full;
					break;
			}

			return {
				data: selectedData,
				cached: true,
				stale: isStale,
				cachedAt: componentData.cachedAt,
				version: this.currentVersion,
			};
		} catch {
			return {
				data: null,
				cached: false,
				stale: false,
				cachedAt: null,
				version: this.currentVersion,
			};
		}
	}

	async setComponent(componentName: string, data: Partial<ComponentCacheEntry>): Promise<void> {
		const componentFile = path.join(this.cacheDir, this.currentVersion!, 'components', `${componentName}.json`);

		const cacheEntry = {
			...data,
			componentName,
			version: this.currentVersion,
			cachedAt: new Date().toISOString(),
		};

		await fs.writeFile(componentFile, JSON.stringify(cacheEntry, null, 2), 'utf-8');

		this.cacheMetadata!.components[componentName] = {
			cachedAt: cacheEntry.cachedAt,
			size: JSON.stringify(cacheEntry).length,
		};
		this.cacheMetadata!.lastUpdated = new Date().toISOString();
		await this.saveMetadata();
	}

	async getDocs(topic: string): Promise<CacheResult<string | null>> {
		const docsFile = path.join(this.cacheDir, this.currentVersion!, 'docs', `${topic}.json`);

		try {
			const data = await fs.readFile(docsFile, 'utf-8');
			const docsData = JSON.parse(data) as DocsCacheEntry;

			const ttlHours = Number(process.env.SPARTAN_CACHE_TTL_HOURS || 24);
			const cacheAge = Date.now() - new Date(docsData.cachedAt).getTime();
			const isStale = cacheAge > ttlHours * 60 * 60 * 1000;

			return {
				data: docsData.content,
				cached: true,
				stale: isStale,
				cachedAt: docsData.cachedAt,
				version: this.currentVersion,
			};
		} catch {
			return {
				data: null,
				cached: false,
				stale: false,
				cachedAt: null,
				version: this.currentVersion,
			};
		}
	}

	async setDocs(topic: string, content: string): Promise<void> {
		const docsFile = path.join(this.cacheDir, this.currentVersion!, 'docs', `${topic}.json`);

		const cacheEntry: DocsCacheEntry = {
			topic,
			content,
			version: this.currentVersion!,
			cachedAt: new Date().toISOString(),
		};

		await fs.writeFile(docsFile, JSON.stringify(cacheEntry, null, 2), 'utf-8');

		this.cacheMetadata!.docs[topic] = {
			cachedAt: cacheEntry.cachedAt,
			size: JSON.stringify(cacheEntry).length,
		};
		this.cacheMetadata!.lastUpdated = new Date().toISOString();
		await this.saveMetadata();
	}

	async getBlock(blockName: string): Promise<CacheResult<unknown>> {
		const blockFile = path.join(this.cacheDir, this.currentVersion!, 'blocks', `${blockName}.json`);

		try {
			const data = await fs.readFile(blockFile, 'utf-8');
			const blockData = JSON.parse(data) as BlockCacheEntry;

			const ttlHours = Number(process.env.SPARTAN_CACHE_TTL_HOURS || 24);
			const cacheAge = Date.now() - new Date(blockData.cachedAt).getTime();
			const isStale = cacheAge > ttlHours * 60 * 60 * 1000;

			return {
				data: blockData,
				cached: true,
				stale: isStale,
				cachedAt: blockData.cachedAt,
				version: this.currentVersion,
			};
		} catch {
			return {
				data: null,
				cached: false,
				stale: false,
				cachedAt: null,
				version: this.currentVersion,
			};
		}
	}

	async setBlock(blockName: string, data: Partial<BlockCacheEntry>): Promise<void> {
		const blockFile = path.join(this.cacheDir, this.currentVersion!, 'blocks', `${blockName}.json`);

		const cacheEntry: BlockCacheEntry = {
			...data,
			blockName,
			version: this.currentVersion!,
			cachedAt: new Date().toISOString(),
		} as BlockCacheEntry;

		await fs.writeFile(blockFile, JSON.stringify(cacheEntry, null, 2), 'utf-8');

		this.cacheMetadata!.blocks![blockName] = {
			cachedAt: cacheEntry.cachedAt,
			size: JSON.stringify(cacheEntry).length,
		};
		this.cacheMetadata!.lastUpdated = new Date().toISOString();
		await this.saveMetadata();
	}

	async clearVersion(): Promise<ClearResult> {
		const versionDir = path.join(this.cacheDir, this.currentVersion!);

		try {
			await fs.rm(versionDir, { recursive: true, force: true });
			await this.ensureCacheDir();
			await this.loadMetadata();

			return {
				success: true,
				message: `Cleared cache for version ${this.currentVersion}`,
				version: this.currentVersion!,
			};
		} catch (error) {
			return {
				success: false,
				message: `Failed to clear cache: ${(error as Error).message}`,
				version: this.currentVersion!,
			};
		}
	}

	async clearAll(): Promise<ClearResult> {
		try {
			const versions = await fs.readdir(this.cacheDir);
			const clearedVersions: string[] = [];

			for (const version of versions) {
				const versionPath = path.join(this.cacheDir, version);
				const stats = await fs.stat(versionPath);

				if (stats.isDirectory()) {
					await fs.rm(versionPath, { recursive: true, force: true });
					clearedVersions.push(version);
				}
			}

			await this.ensureCacheDir();
			await this.loadMetadata();

			return {
				success: true,
				message: `Cleared cache for ${clearedVersions.length} version(s)`,
				versions: clearedVersions,
			};
		} catch (error) {
			return {
				success: false,
				message: `Failed to clear all cache: ${(error as Error).message}`,
				versions: [],
			};
		}
	}

	async getStats(): Promise<StatsResult> {
		try {
			const versions = await fs.readdir(this.cacheDir);
			const versionStats: StatsResult['versions'] = [];

			for (const version of versions) {
				const versionPath = path.join(this.cacheDir, version);
				const stats = await fs.stat(versionPath);

				if (stats.isDirectory()) {
					const metadataPath = path.join(versionPath, 'metadata.json');
					try {
						const metadataContent = await fs.readFile(metadataPath, 'utf-8');
						const metadata = JSON.parse(metadataContent) as CacheMetadata;

						const componentCount = Object.keys(metadata.components || {}).length;
						const docsCount = Object.keys(metadata.docs || {}).length;
						const blockCount = Object.keys(metadata.blocks || {}).length;

						versionStats.push({
							version,
							componentCount,
							docsCount,
							blockCount,
							createdAt: metadata.createdAt,
							lastUpdated: metadata.lastUpdated,
							isCurrent: version === this.currentVersion,
						});
					} catch {
						// Skip invalid directories
					}
				}
			}

			return {
				currentVersion: this.currentVersion,
				totalVersions: versionStats.length,
				versions: versionStats,
			};
		} catch (error) {
			return {
				currentVersion: this.currentVersion,
				totalVersions: 0,
				versions: [],
				error: (error as Error).message,
			};
		}
	}

	async listVersions(): Promise<VersionInfo[]> {
		try {
			const versions = await fs.readdir(this.cacheDir);
			const validVersions: VersionInfo[] = [];

			for (const version of versions) {
				const versionPath = path.join(this.cacheDir, version);
				const stats = await fs.stat(versionPath);

				if (stats.isDirectory()) {
					validVersions.push({
						version,
						path: versionPath,
						isCurrent: version === this.currentVersion,
					});
				}
			}

			return validVersions;
		} catch {
			return [];
		}
	}

	async switchVersion(version: string): Promise<{ success: boolean; version: string; message: string }> {
		this.currentVersion = version;
		await this.ensureCacheDir();
		await this.loadMetadata();

		return {
			success: true,
			version: this.currentVersion,
			message: `Switched to version ${version}`,
		};
	}
}

// Export singleton instance
export const cacheManager = new CacheManager();
