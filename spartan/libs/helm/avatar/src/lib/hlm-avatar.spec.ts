import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnAvatarFallback } from '@spartan-ng/brain/avatar';
import { HlmAvatar } from './hlm-avatar';

@Component({
	selector: 'hlm-mock',
	imports: [BrnAvatarFallback, HlmAvatar],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-avatar [class]="class()" id="fallbackOnly">
			<span brnAvatarFallback>fallback</span>
		</hlm-avatar>
	`,
})
class Mock {
	public readonly class = input<string>();
}

describe('HlmAvatarComponent', () => {
	let component: HlmAvatar;
	let fixture: ComponentFixture<HlmAvatar>;

	beforeEach(() => {
		fixture = TestBed.createComponent(HlmAvatar);
		component = fixture.componentInstance;
	});

	it('should compile', () => {
		expect(component).toBeTruthy();
	});

	it('should add the default classes if no inputs are provided', () => {
		fixture.detectChanges();
		expect(fixture.nativeElement.className).toBe('flex overflow-hidden relative rounded-full shrink-0 size-8');
	});

	it('should add any user defined classes', () => {
		const mockFixture = TestBed.createComponent(Mock);
		mockFixture.componentRef.setInput('class', 'test-class');
		mockFixture.detectChanges();
		const avatar = mockFixture.nativeElement.querySelector('hlm-avatar');
		expect(avatar.className).toContain('test-class');
	});

	it('should support brn directives', () => {
		const mockFixture = TestBed.createComponent(Mock);
		mockFixture.detectChanges();
		expect(mockFixture.nativeElement.querySelector('span').textContent).toBe('fallback');
	});
});
