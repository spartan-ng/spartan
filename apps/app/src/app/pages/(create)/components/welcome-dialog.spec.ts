import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vitest } from 'vitest';
import { WelcomeDialog } from './welcome-dialog';

describe('WelcomeDialog', () => {
	let originalMatchMedia: PropertyDescriptor | undefined;
	let originalScrollIntoView: typeof Element.prototype.scrollIntoView | undefined;
	let originalLocalStorage: PropertyDescriptor | undefined;

	beforeAll(() => {
		originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
		originalScrollIntoView = Element.prototype.scrollIntoView;
		originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
	});

	afterAll(() => {
		if (originalMatchMedia) {
			Object.defineProperty(window, 'matchMedia', originalMatchMedia);
		}
		if (originalScrollIntoView) {
			Element.prototype.scrollIntoView = originalScrollIntoView;
		}
		if (originalLocalStorage) {
			Object.defineProperty(globalThis, 'localStorage', originalLocalStorage);
		}
	});

	beforeEach(async () => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vitest.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				addEventListener: vitest.fn(),
				removeEventListener: vitest.fn(),
				dispatchEvent: vitest.fn(),
			})),
		});
		Element.prototype.scrollIntoView = vitest.fn();
		Object.defineProperty(globalThis, 'localStorage', {
			writable: true,
			value: {
				getItem: vitest.fn(),
				setItem: vitest.fn(),
				removeItem: vitest.fn(),
			},
		});

		await TestBed.configureTestingModule({
			providers: [provideRouter([]), provideHttpClient()],
			imports: [WelcomeDialog],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(WelcomeDialog);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should be open when localStorage has no dismissal flag', () => {
		const fixture = TestBed.createComponent(WelcomeDialog);
		fixture.detectChanges();
		expect(fixture.componentInstance['_open']()).toBe('open');
	});

	it('should be closed when localStorage has dismissal flag', () => {
		(globalThis.localStorage.getItem as ReturnType<typeof vitest.fn>).mockReturnValue('true');
		const fixture = TestBed.createComponent(WelcomeDialog);
		fixture.detectChanges();
		expect(fixture.componentInstance['_open']()).toBe('closed');
	});

	it('should dismiss and write to localStorage', () => {
		const fixture = TestBed.createComponent(WelcomeDialog);
		fixture.detectChanges();
		const component = fixture.componentInstance;
		const ctx = { close: vitest.fn() };
		component['_dismiss'](ctx);
		expect(globalThis.localStorage.setItem).toHaveBeenCalledWith('spartan-create-welcome-dismissed', 'true');
		expect(ctx.close).toHaveBeenCalledTimes(1);
	});

	it('should render dialog content when open', async () => {
		const fixture = TestBed.createComponent(WelcomeDialog);
		fixture.detectChanges();
		await fixture.whenStable();
		const title = document.body.querySelector('h3');
		expect(title?.textContent?.trim()).toBe('Build your own spartan');
		const gotStarted = Array.from(document.body.querySelectorAll('button')).find((b) =>
			b.textContent?.trim().includes('Get Started'),
		);
		expect(gotStarted).toBeTruthy();
	});
});
