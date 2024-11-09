import { Component, Input } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnAvatarFallbackDirective, BrnAvatarImageDirective } from '@spartan-ng/ui-avatar-brain';
import { HlmAvatarComponent } from './hlm-avatar.component';

@Component({
	selector: 'hlm-mock',
	imports: [BrnAvatarImageDirective, BrnAvatarFallbackDirective, HlmAvatarComponent],
	template: `
		<hlm-avatar [class]="class" id="fallbackOnly">
			<span brnAvatarFallback>fallback</span>
		</hlm-avatar>
	`,
	standalone: true,
})
class MockComponent {
	@Input() class = '';
}

describe('HlmAvatarComponent', () => {
	let component: HlmAvatarComponent;
	let fixture: ComponentFixture<HlmAvatarComponent>;

	beforeEach(() => {
		fixture = TestBed.createComponent(HlmAvatarComponent);
		component = fixture.componentInstance;
	});

	it('should compile', () => {
		expect(component).toBeTruthy();
	});

	it('should add the default classes if no inputs are provided', () => {
		fixture.detectChanges();
		expect(fixture.nativeElement.className).toBe('flex h-10 overflow-hidden relative rounded-full shrink-0 w-10');
	});

	it('should add any user defined classes', () => {
		const mockFixture = TestBed.createComponent(MockComponent);
		mockFixture.componentRef.setInput('class', 'test-class');
		mockFixture.detectChanges();
		const avatar = mockFixture.nativeElement.querySelector('hlm-avatar');
		expect(avatar.className).toContain('test-class');
	});

	it('should change the size when the variant is changed', () => {
		fixture.componentRef.setInput('variant', 'small');
		fixture.detectChanges();
		expect(fixture.nativeElement.className).toContain('h-6');
		expect(fixture.nativeElement.className).toContain('w-6');
		expect(fixture.nativeElement.className).toContain('text-xs');

		fixture.componentRef.setInput('variant', 'large');
		fixture.detectChanges();
		expect(fixture.nativeElement.className).toContain('h-14');
		expect(fixture.nativeElement.className).toContain('w-14');
		expect(fixture.nativeElement.className).toContain('text-lg');
	});

	it('should support brn directives', () => {
		const mockFixture = TestBed.createComponent(MockComponent);
		mockFixture.detectChanges();
		expect(mockFixture.nativeElement.querySelector('span').textContent).toBe('fallback');
	});
});
