import { ChangeDetectionStrategy, Component, PLATFORM_ID } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnAvatarFallback } from './brn-avatar-fallback';

@Component({
	selector: 'brn-mock',
	imports: [BrnAvatarFallback],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<span *brnAvatarFallback>fallback</span>
		<span brnAvatarFallback>fallback2</span>
	`,
})
class BrnMock {}

describe('BrnAvatarFallbackDirective', () => {
	let component: BrnMock;
	let fixture: ComponentFixture<BrnMock>;

	beforeEach(() => {
		fixture = TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' }).createComponent(BrnMock);
		component = fixture.componentInstance;
	});

	it('should compile', () => {
		expect(component).toBeTruthy();
	});
});
