import { convertNxGenerator } from '@nx/devkit';
import migrateInputIdGenerator from './generator';

export default convertNxGenerator(migrateInputIdGenerator);
