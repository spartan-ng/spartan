import type { Style } from '../../utils/supported-styles';
import { type GenerateAs } from './lib/generate-as';

export interface HlmBaseGeneratorSchema {
	name: string;
	directory?: string;
	rootProject?: boolean;
	tags?: string;
	peerDependencies?: Record<string, string>;
	angularCli?: boolean;
	buildable: boolean;
	generateAs: GenerateAs;
	importAlias: string;
	style: Style;
	overwrite?: boolean;
	dryRun?: boolean;
}
