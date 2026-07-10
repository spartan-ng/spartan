import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vitest } from 'vitest';
import { App } from './app';

describe('AppComponent', () => {
	let originalLocalStorage: PropertyDescriptor | undefined;

	beforeAll(() => {
		originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
	});

	afterAll(() => {
		if (originalLocalStorage) {
			Object.defineProperty(globalThis, 'localStorage', originalLocalStorage);
		}
	});

	beforeEach(async () => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vitest.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				addEventListener: vitest.fn(),
				removeEventListener: vitest.fn(),
				dispatchEvent: vitest.fn(),
			})),
		});
		Object.defineProperty(globalThis, 'localStorage', {
			writable: true,
			value: { getItem: vitest.fn(), setItem: vitest.fn() },
		});

		await TestBed.configureTestingModule({
			providers: [provideRouter([]), provideHttpClient()],
			imports: [App],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(App);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
