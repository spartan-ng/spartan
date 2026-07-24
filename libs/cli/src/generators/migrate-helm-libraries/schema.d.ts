import type { Style } from '../../utils/supported-styles';
import { type GenerateAs } from '../base/lib/generate-as';
import type { Primitive } from '../ui/primitives';

export interface MigrateHelmLibrariesGeneratorSchema {
	directory?: string;
	rootProject?: boolean;
	tags?: string;
	angularCli?: boolean;
	generateAs: GenerateAs;
	buildable: boolean;
	importAlias: string;
	style: Style;
	libraries?: Primitive[];
}
