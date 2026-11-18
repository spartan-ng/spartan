import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { classes, hlm } from './hlm';

describe('hlm', () => {
	it('should join conditional classes and resolve tailwind conflicts', () => {
		const hidden = Math.random() > 1;
		expect(hlm('px-2 py-1', hidden && 'hidden', { 'text-white': true }, ['px-4'])).toBe('py-1 text-white px-4');
	});
});

describe('classes', () => {
	it('should apply the classes merged with hlm', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'p-2';

		const elementRef = new ElementRef(element);

		TestBed.runInInjectionContext(() => {
			classes(() => ['p-4', 'text-white'], { elementRef });
		});

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(element.className).toBe('text-white p-2');
	});
});
