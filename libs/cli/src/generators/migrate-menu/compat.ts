import { convertNxGenerator } from '@nx/devkit';
import { migrateMenuGenerator } from './generator';

export default convertNxGenerator(migrateMenuGenerator);
