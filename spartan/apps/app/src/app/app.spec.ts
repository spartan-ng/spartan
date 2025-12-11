import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vitest } from 'vitest';
import { App } from './app';

describe('AppComponent', () => {
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
