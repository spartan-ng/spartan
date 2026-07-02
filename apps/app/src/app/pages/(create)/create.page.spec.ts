import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vitest } from 'vitest';
import CreatePage from './create.page';

describe('CreatePage', () => {
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
		Object.defineProperty(globalThis, 'localStorage', {
			writable: true,
			value: { getItem: vitest.fn(), setItem: vitest.fn() },
		});
		Element.prototype.scrollIntoView = vitest.fn();

		await TestBed.configureTestingModule({
			providers: [provideRouter([]), provideHttpClient()],
			imports: [CreatePage],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(CreatePage);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should render preview and customizer', () => {
		const fixture = TestBed.createComponent(CreatePage);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		expect(element.querySelector('spartan-preview')).toBeTruthy();
		expect(element.querySelector('spartan-customizer')).toBeTruthy();
	});
});
