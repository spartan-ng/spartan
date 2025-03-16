import { convertNxGenerator } from '@nx/devkit';
import { healthcheckGenerator } from './generator';
import { HealthcheckGeneratorSchema } from './schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default convertNxGenerator((tree: any, schema: HealthcheckGeneratorSchema & { angularCli?: boolean }) =>
	healthcheckGenerator(tree, { ...schema, angularCli: true }),
);
