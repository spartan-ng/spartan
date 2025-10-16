import { convertNxGenerator } from '@nx/devkit';
import { migrateIconGenerator } from './generator';

export default convertNxGenerator(migrateIconGenerator);
