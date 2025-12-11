import { convertNxGenerator } from '@nx/devkit';
import hlmUIGenerator from './generator';
import type { HlmUIGeneratorSchema } from './schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default convertNxGenerator((tree: any, schema: HlmUIGeneratorSchema & { angularCli?: boolean }) =>
	hlmUIGenerator(tree, { ...schema, angularCli: true }),
);
