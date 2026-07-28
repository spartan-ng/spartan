import { convertNxGenerator } from '@nx/devkit';
import migrateDatePickerMinMaxGenerator from './generator';
import type { MigrateDatePickerMinMaxGeneratorSchema } from './schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default convertNxGenerator(
	(tree: any, schema: MigrateDatePickerMinMaxGeneratorSchema & { angularCli?: boolean }) =>
		migrateDatePickerMinMaxGenerator(tree, { ...schema, angularCli: true }),
);
