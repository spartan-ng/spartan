import { convertNxGenerator } from '@nx/devkit';
import { migrateHelmImportsGenerator } from './generator';

export default convertNxGenerator(migrateHelmImportsGenerator);
