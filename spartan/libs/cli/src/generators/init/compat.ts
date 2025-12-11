import { convertNxGenerator, type Tree } from '@nx/devkit';
import { spartanInitGenerator } from './generator';

export default convertNxGenerator((tree: Tree) => spartanInitGenerator(tree));
