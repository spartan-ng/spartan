import { ChangeDetectionStrategy, Component, PLATFORM_ID } from '@angular/core';
import { type ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { hexColorFor, isBright } from '@spartan-ng/brain/avatar';
import { HlmAvatarFallbackDirective } from './hlm-avatar-fallback.directive';

@Component({
	selector: 'hlm-mock',
	standalone: true,
	imports: [HlmAvatarFallbackDirective],
	template: `
		<span hlmAvatarFallback [class]="userCls" [autoColor]="autoColor">fallback2</span>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class HlmMockComponent {
	public userCls = '';
	public autoColor = false;
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
			'bg-muted flex h-full items-center justify-center rounded-full w-full',
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

	describe('autoColor', () => {
		beforeEach(() => {
			component.autoColor = true;
			fixture.detectChanges();
		});

		it('should remove the bg-muted class from the component', fakeAsync(() => {
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector('span').className).not.toContain('bg-muted');
		}));

		it('should remove add a text color class and hex backgroundColor style depending on its content', () => {
			const hex = hexColorFor('fallback2');
			const textCls = isBright(hex) ? 'text-black' : 'text-white';
			expect(fixture.nativeElement.querySelector('span').className).toContain(textCls);
			expect(fixture.nativeElement.querySelector('span').style.backgroundColor).toBe('rgb(144, 53, 149)');
		});
	});
});
