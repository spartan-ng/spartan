import { convertNxGenerator } from '@nx/devkit';
import { migrateBrainImportsGenerator } from './generator';

export default convertNxGenerator(migrateBrainImportsGenerator);
