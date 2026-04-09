import { convertNxGenerator } from '@nx/devkit';
import { migrateIconSelectorGenerator } from './generator';

export default convertNxGenerator(migrateIconSelectorGenerator);
