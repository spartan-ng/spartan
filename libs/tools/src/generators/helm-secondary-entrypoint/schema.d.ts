export interface HelmSecondaryEntrypointGeneratorSchema {
	name: string;
	story?: boolean;
	documentation?: boolean;
	generate?: 'component' | 'directive' | 'none';
	description?: string;
}
