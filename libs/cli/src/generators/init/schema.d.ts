import type { HlmThemeGeneratorSchema } from '../theme/schema';

export type SpartanInitGeneratorSchema = Pick<
	HlmThemeGeneratorSchema,
	'project' | 'theme' | 'stylesEntryPoint' | 'prefix' | 'acceptTailwindV3'
>;
