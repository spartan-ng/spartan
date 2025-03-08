import '@testing-library/jest-dom';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
