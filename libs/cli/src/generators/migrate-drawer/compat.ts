import { convertNxGenerator } from '@nx/devkit';
import migrateDrawerGenerator from './generator';
import type { MigrateDrawerGeneratorSchema } from './schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default convertNxGenerator((tree: any, schema: MigrateDrawerGeneratorSchema) =>
	migrateDrawerGenerator(tree, { ...schema, angularCli: true }),
);
