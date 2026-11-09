import { convertNxGenerator } from '@nx/devkit';
import migrateCnGenerator from './generator';

export default convertNxGenerator(migrateCnGenerator);
