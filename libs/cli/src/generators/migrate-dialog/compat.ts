import { convertNxGenerator } from '@nx/devkit';
import { migrateDialogGenerator } from './generator';

export default convertNxGenerator(migrateDialogGenerator);
