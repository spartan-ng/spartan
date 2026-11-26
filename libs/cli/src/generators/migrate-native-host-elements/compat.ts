import { convertNxGenerator } from '@nx/devkit';
import migrateNativeHostElementsGenerator from './generator';

export default convertNxGenerator(migrateNativeHostElementsGenerator);
