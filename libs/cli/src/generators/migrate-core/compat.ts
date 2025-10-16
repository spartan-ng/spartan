import { convertNxGenerator } from '@nx/devkit';
import { migrateCoreGenerator } from './generator';

export default convertNxGenerator(migrateCoreGenerator);
