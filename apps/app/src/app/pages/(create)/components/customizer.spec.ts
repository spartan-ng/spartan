import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vitest } from 'vitest';
import { Customizer } from './customizer';

describe('Customizer', () => {
	let originalMatchMedia: PropertyDescriptor | undefined;
	let originalScrollIntoView: typeof Element.prototype.scrollIntoView | undefined;

	beforeAll(() => {
		originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
		originalScrollIntoView = Element.prototype.scrollIntoView;
	});

	afterAll(() => {
		if (originalMatchMedia) {
			Object.defineProperty(window, 'matchMedia', originalMatchMedia);
		}
		if (originalScrollIntoView) {
			Element.prototype.scrollIntoView = originalScrollIntoView;
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

		await TestBed.configureTestingModule({
			providers: [provideRouter([]), provideHttpClient()],
			imports: [Customizer],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(Customizer);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should render all pickers', () => {
		const fixture = TestBed.createComponent(Customizer);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const labels = element.querySelectorAll('label');
		const labelTexts = Array.from(labels).map((l) => l.textContent?.trim());
		expect(labelTexts).toContain('Style');
		expect(labelTexts).toContain('Base Color');
		expect(labelTexts).toContain('Theme');
		expect(labelTexts).toContain('Chart Color');
		expect(labelTexts).toContain('Font (Body)');
		expect(labelTexts).toContain('Font (Heading)');
		expect(labelTexts).toContain('Icon Library');
		expect(labelTexts).toContain('Radius');
		expect(labelTexts).toContain('Menu Accent');
		expect(labelTexts).toContain('Menu Color');
	});

	it('should have a Get Code button', () => {
		const fixture = TestBed.createComponent(Customizer);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const buttons = element.querySelectorAll('button');
		const copyBtn = Array.from(buttons).find((b) => b.textContent?.trim().includes('Get Code'));
		expect(copyBtn).toBeTruthy();
	});
});
