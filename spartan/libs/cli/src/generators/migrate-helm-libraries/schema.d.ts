import { type GenerateAs } from '../base/lib/generate-as';

export interface MigrateHelmLibrariesGeneratorSchema {
	directory?: string;
	rootProject?: boolean;
	tags?: string;
	angularCli?: boolean;
	generateAs: GenerateAs;
	buildable: boolean;
	importAlias: string;
}
