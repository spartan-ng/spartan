import { convertNxGenerator } from '@nx/devkit';
import { migrateScrollAreaGenerator } from './generator';

export default convertNxGenerator(migrateScrollAreaGenerator);
