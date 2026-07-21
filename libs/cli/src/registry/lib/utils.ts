import path from 'node:path';
import type { RegistryItemFile } from '../schema/schema';

export function isUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

export function isLocalFile(value: string): boolean {
	return value.startsWith('.') || value.startsWith('/') || value.startsWith('~/');
}

export function normalizeSlashes(value: string): string {
	return value.replace(/\\/g, '/');
}

export function stripTemplateExtension(filePath: string): string {
	return filePath.endsWith('.template') ? filePath.slice(0, -'.template'.length) : filePath;
}

export function renderSpartanTemplateTokens(content: string, context: { importAlias: string }): string {
	return content.replaceAll('<%- importAlias %>', context.importAlias);
}

export function targetPathForRegistryFile(file: RegistryItemFile, componentName: string): string {
	if (file.target) {
		return normalizeSlashes(file.target);
	}

	const filePath = stripTemplateExtension(file.path);
	const marker = `/libs/${componentName}/files/`;
	const markerIndex = filePath.indexOf(marker);
	if (markerIndex >= 0) {
		return normalizeSlashes(filePath.slice(markerIndex + marker.length));
	}

	const filesIndex = filePath.indexOf('/files/');
	if (filesIndex >= 0) {
		return normalizeSlashes(filePath.slice(filesIndex + '/files/'.length));
	}

	return normalizeSlashes(path.basename(filePath));
}

export function dedupe<T>(items: T[]): T[] {
	return [...new Set(items)];
}
