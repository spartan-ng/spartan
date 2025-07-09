import { ChangeDetectionStrategy, Component, PLATFORM_ID } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HlmAvatarFallbackDirective } from './hlm-avatar-fallback.directive';

@Component({
	selector: 'hlm-mock',
	imports: [HlmAvatarFallbackDirective],
	template: `
		<span hlmAvatarFallback [class]="userCls">fallback2</span>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class HlmMockComponent {
	public userCls = '';
}

describe('HlmAvatarFallbackDirective', () => {
	let component: HlmMockComponent;
	let fixture: ComponentFixture<HlmMockComponent>;

	beforeEach(() => {
		fixture = TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' }).createComponent(HlmMockComponent);
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
