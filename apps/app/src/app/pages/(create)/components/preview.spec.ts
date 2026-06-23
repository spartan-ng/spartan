import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vitest } from 'vitest';
import { Preview } from './preview';

describe('Preview', () => {
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

		await TestBed.configureTestingModule({
			providers: [provideRouter([]), provideHttpClient()],
			imports: [Preview],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(Preview);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should render an iframe', () => {
		const fixture = TestBed.createComponent(Preview);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const iframe = element.querySelector('iframe');
		expect(iframe).toBeTruthy();
		expect(iframe?.title).toBe('Preview');
	});
});
