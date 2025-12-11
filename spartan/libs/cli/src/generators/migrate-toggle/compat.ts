import { convertNxGenerator } from '@nx/devkit';
import migrateToggleGenerator from './generator';

export default convertNxGenerator(migrateToggleGenerator);
