import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { ApplicationRef, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnHoverCardContentService } from './brn-hover-card-content.service';

describe('BrnHoverCardContentService direction', () => {
	const setup = (dir: 'ltr' | 'rtl' | null) => {
		TestBed.configureTestingModule({ providers: [BrnHoverCardContentService, Directionality] });
		const directionality = TestBed.inject(Directionality);
		if (dir) {
			directionality.valueSignal.set(dir);
		}
		const overlay = TestBed.inject(Overlay);
		const createSpy = jest.spyOn(overlay, 'create');
		const service = TestBed.inject(BrnHoverCardContentService);

		service.setConfig({ attachTo: new ElementRef(document.createElement('div')) });
		return createSpy;
	};

	afterEach(() => {
		TestBed.resetTestingModule();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('creates the overlay with the ambient rtl direction', () => {
		const createSpy = setup('rtl');
		expect(createSpy).toHaveBeenCalled();
		expect(createSpy.mock.calls.at(-1)?.[0]?.direction).toBe('rtl');
	});

	it('creates the overlay with ltr by default', () => {
		const createSpy = setup(null);
		expect(createSpy).toHaveBeenCalled();
		expect(createSpy.mock.calls.at(-1)?.[0]?.direction).toBe('ltr');
	});

	it('updates the open overlay direction when the ambient direction changes', () => {
		const createSpy = setup(null);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const overlayRef = createSpy.mock.results.at(-1)?.value as any;
		const setDirectionSpy = jest.spyOn(overlayRef, 'setDirection');

		TestBed.inject(Directionality).valueSignal.set('rtl');
		TestBed.inject(ApplicationRef).tick();

		expect(setDirectionSpy).toHaveBeenCalledWith('rtl');
	});
});
