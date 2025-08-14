import { convertNxGenerator } from '@nx/devkit';
import { migrateProgressGenerator } from './generator';

export default convertNxGenerator(migrateProgressGenerator);
