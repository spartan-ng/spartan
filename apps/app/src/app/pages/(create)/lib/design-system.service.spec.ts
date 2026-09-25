import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DesignSystemService } from './design-system.service';

describe('DesignSystemService', () => {
	let service: DesignSystemService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideRouter([])],
		});
		service = TestBed.inject(DesignSystemService);
	});

	it('should start with default config', () => {
		const state = service.state();
		expect(state.style).toBe('nova');
		expect(state.baseColor).toBe('neutral');
		expect(state.theme).toBe('neutral');
		expect(state.iconLibrary).toBe('lucide');
		expect(state.font).toBe('inter');
	});

	it('should update individual params', () => {
		service.update({ style: 'vega' });
		expect(service.state().style).toBe('vega');
	});

	it('should generate preset code', () => {
		const code = service.presetCode();
		expect(code).toMatch(/^b[0-9a-zA-Z]+$/);
	});

	it('should update multiple params at once', () => {
		service.update({ style: 'lyra', baseColor: 'zinc', font: 'geist' });
		const state = service.state();
		expect(state.style).toBe('lyra');
		expect(state.baseColor).toBe('zinc');
		expect(state.font).toBe('geist');
	});

	it('should update preset code after config change', () => {
		const initial = service.presetCode();
		service.update({ theme: 'blue' });
		const updated = service.presetCode();
		expect(updated).not.toBe(initial);
	});
});
