import { GenerateAs } from './lib/generate-as';

export interface HlmBaseGeneratorSchema {
	primitiveName: string;
	internalName: string;
	publicName: string;
	directory?: string;
	rootProject?: boolean;
	tags?: string;
	peerDependencies?: Record<string, string>;
	angularCli?: boolean;
	buildable: boolean;
	generateAs: GenerateAs;
}
