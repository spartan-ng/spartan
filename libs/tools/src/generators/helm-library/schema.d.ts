export interface HelmLibraryGeneratorSchema {
	name: string;
	story?: boolean;
	documentation?: boolean;
	generate?: 'component' | 'directive' | 'none';
	description?: string;
}
