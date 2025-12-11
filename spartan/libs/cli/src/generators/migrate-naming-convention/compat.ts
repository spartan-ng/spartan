import { convertNxGenerator } from '@nx/devkit';
import migrateNamingConventionGenerator from './generator';

export default convertNxGenerator(migrateNamingConventionGenerator);
