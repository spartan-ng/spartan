import { convertNxGenerator } from '@nx/devkit';
import { migrateInputOtpGenerator } from './generator';

export default convertNxGenerator(migrateInputOtpGenerator);
