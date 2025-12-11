import { convertNxGenerator } from '@nx/devkit';
import migrateSelectGenerator from './generator';

export default convertNxGenerator(migrateSelectGenerator);
