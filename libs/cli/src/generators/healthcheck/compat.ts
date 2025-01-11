import { convertNxGenerator } from '@nx/devkit';
import { healthcheckGenerator } from './generator';

export default convertNxGenerator(healthcheckGenerator);
