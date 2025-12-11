export type SupportedLibraries = Record<string, SupportedLibrary>;

export interface SupportedLibrary {
	name: string;
	peerDependencies: Record<string, string>;
}
