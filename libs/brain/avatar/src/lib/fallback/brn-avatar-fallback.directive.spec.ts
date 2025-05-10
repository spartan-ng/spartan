import { ChangeDetectionStrategy, Component, PLATFORM_ID } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnAvatarFallbackDirective } from './brn-avatar-fallback.directive';

@Component({
	selector: 'brn-mock',
	standalone: true,
	imports: [BrnAvatarFallbackDirective],
	template: `
		<span *brnAvatarFallback>fallback</span>
		<span brnAvatarFallback>fallback2</span>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class BrnMockComponent {}

describe('BrnAvatarFallbackDirective', () => {
	let component: BrnMockComponent;
	let fixture: ComponentFixture<BrnMockComponent>;

	beforeEach(() => {
		fixture = TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' }).createComponent(BrnMockComponent);
		component = fixture.componentInstance;
	});

	it('should compile', () => {
		expect(component).toBeTruthy();
	});
});
