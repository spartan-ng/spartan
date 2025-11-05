import { convertNxGenerator, type Tree } from '@nx/devkit';
import { spartanInitGenerator } from './generator';
import type { InitGeneratorSchema } from './schema';

export default convertNxGenerator((tree: Tree, schema: InitGeneratorSchema) =>
	spartanInitGenerator(tree, { ...schema }),
);
