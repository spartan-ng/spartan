import { ChangeDetectionStrategy, Component, PLATFORM_ID } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HlmAvatarFallback } from './hlm-avatar-fallback';

@Component({
	selector: 'hlm-mock',
	imports: [HlmAvatarFallback],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<span hlmAvatarFallback [class]="userCls">fallback2</span>
	`,
})
class HlmMock {
	public userCls = '';
}

describe('HlmAvatarFallbackDirective', () => {
	let component: HlmMock;
	let fixture: ComponentFixture<HlmMock>;

	beforeEach(() => {
		fixture = TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' }).createComponent(HlmMock);
		component = fixture.componentInstance;
	});

	it('should compile', () => {
		expect(component).toBeTruthy();
	});

	it('should contain the default classes if no inputs are provided', () => {
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('span').className).toBe(
			'bg-muted flex items-center justify-center rounded-full size-full',
		);
	});

	it('should add any user defined classes', async () => {
		component.userCls = 'test-class';

		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('span').className).toContain('test-class');
	});
	it('should merge bg-destructive correctly when set as user defined class, therefore removing bg-muted', async () => {
		component.userCls = 'bg-destructive ';

		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('span').className).toContain('bg-destructive');
	});
});
