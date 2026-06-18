import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { provideSpartanHlm } from './provide-spartan-hlm';

describe('provideSpartanHlm', () => {
	it('should provide OVERLAY_DEFAULT_CONFIG with usePopover set to false', () => {
		TestBed.configureTestingModule({
			providers: [provideSpartanHlm()],
		});

		const config = TestBed.inject(OVERLAY_DEFAULT_CONFIG);
		expect(config).toBeDefined();
		expect(config.usePopover).toBe(false);
	});

	it('should return EnvironmentProviders', () => {
		const providers = provideSpartanHlm();
		expect(providers).toBeDefined();
	});

	it('should be compatible with other providers', () => {
		TestBed.configureTestingModule({
			providers: [provideSpartanHlm(), { provide: 'custom-token', useValue: 'custom-value' }],
		});

		const config = TestBed.inject(OVERLAY_DEFAULT_CONFIG);
		const customToken = TestBed.inject('custom-token' as never);

		expect(config.usePopover).toBe(false);
		expect(customToken).toBe('custom-value');
	});
});
