import { convertNxGenerator, type Tree } from '@nx/devkit';
import { spartanInitGenerator } from './generator';
import type { SpartanInitGeneratorSchema } from './schema';

export default convertNxGenerator((tree: Tree, options: SpartanInitGeneratorSchema) =>
	spartanInitGenerator(tree, options),
);
