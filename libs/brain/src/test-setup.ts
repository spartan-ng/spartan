import '@testing-library/jest-dom';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// ---- ResizeObserver mock for Angular tests ----
class ResizeObserverMock {
	public observe = jest.fn();
	public unobserve = jest.fn();
	public disconnect = jest.fn();
}

globalThis.ResizeObserver = ResizeObserverMock;
