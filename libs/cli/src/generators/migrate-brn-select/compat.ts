import { convertNxGenerator } from '@nx/devkit';
import { migrateBrnSelectGenerator } from './generator';

export default convertNxGenerator(migrateBrnSelectGenerator);
