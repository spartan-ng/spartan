import { convertNxGenerator } from '@nx/devkit';
import migrateCollapsibleGenerator from './generator';

export default convertNxGenerator(migrateCollapsibleGenerator);
