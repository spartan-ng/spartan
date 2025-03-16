import { convertNxGenerator } from '@nx/devkit';
import migrateHelmLibrariesGenerator from './generator';
import { MigrateHelmLibrariesGeneratorSchema } from './schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default convertNxGenerator((tree: any, schema: MigrateHelmLibrariesGeneratorSchema & { angularCli?: boolean }) =>
	migrateHelmLibrariesGenerator(tree, { ...schema, angularCli: true }),
);
