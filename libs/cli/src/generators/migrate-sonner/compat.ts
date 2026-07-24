import { convertNxGenerator } from '@nx/devkit';
import { migrateSonnerGenerator } from './generator';

export default convertNxGenerator(migrateSonnerGenerator);
