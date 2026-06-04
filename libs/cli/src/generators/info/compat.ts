import { convertNxGenerator } from '@nx/devkit';
import { infoGenerator } from './generator';
import type { InfoGeneratorSchema } from './schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default convertNxGenerator((tree: any, schema: InfoGeneratorSchema & { angularCli?: boolean }) =>
	infoGenerator(tree, { ...schema, angularCli: true }),
);
