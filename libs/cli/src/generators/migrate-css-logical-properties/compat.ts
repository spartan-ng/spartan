import { convertNxGenerator } from '@nx/devkit';
import { migrateCssLogicalPropertiesGenerator } from './generator';

export default convertNxGenerator(migrateCssLogicalPropertiesGenerator);
