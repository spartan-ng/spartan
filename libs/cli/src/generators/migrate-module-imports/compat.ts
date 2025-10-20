import { convertNxGenerator } from '@nx/devkit';
import { migrateModuleImportsGenerator } from './generator';

export default convertNxGenerator(migrateModuleImportsGenerator);
