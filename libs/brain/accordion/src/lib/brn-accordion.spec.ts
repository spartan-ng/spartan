import { FocusMonitor, type FocusOrigin } from '@angular/cdk/a11y';
import { ApplicationRef, ChangeDetectionStrategy, Component, ErrorHandler, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { config, type Observable, Subject } from 'rxjs';
import { BrnAccordion } from './brn-accordion';
import { BrnAccordionContent } from './brn-accordion-content';
import { BrnAccordionItem } from './brn-accordion-item';
import { BrnAccordionTrigger } from './brn-accordion-trigger';

// A signal write that throws inside an RxJS subscriber is reported via RxJS' unhandled-error
// channel, not thrown synchronously, so capture it there and flush the macrotask it uses.
async function collectUnhandledErrors(body: () => void | Promise<void>): Promise<unknown[]> {
	const unhandled: unknown[] = [];
	const previousOnUnhandledError = config.onUnhandledError;
	config.onUnhandledError = (error) => unhandled.push(error);
	try {
		await body();
	} finally {
		// Flush the macrotask RxJS uses to surface unhandled subscriber errors, then restore -
		// in a finally so a throwing body still captures (not leaks) any queued error.
		await new Promise((resolve) => setTimeout(resolve));
		config.onUnhandledError = previousOnUnhandledError;
	}
	return unhandled;
}

function ng0600Errors(errors: unknown[]): unknown[] {
	return errors.filter((error) => String((error as Error)?.message ?? error).includes('NG0600'));
}

// Lets a test push focus-origin changes on demand, standing in for the real FocusMonitor.
class FakeFocusMonitor {
	public readonly origin$ = new Subject<FocusOrigin>();
	monitor(): Observable<FocusOrigin> {
		return this.origin$;
	}
	stopMonitoring(): void {
		/* noop */
	}
}

// probe() is bound in the template, so it runs during render. When armed it fires onRender,
// letting a test reproduce a focus/blur event arriving mid-change-detection.
abstract class ProbeHost {
	public readonly armed = signal(false);
	public onRender: () => void = () => {
		/* set by the test */
	};

	probe(): string {
		if (this.armed()) {
			this.onRender();
		}
		return '';
	}
}

@Component({
	imports: [BrnAccordion, BrnAccordionItem, BrnAccordionTrigger, BrnAccordionContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnAccordion>
			<div brnAccordionItem isOpened>
				<h3>
					<button brnAccordionTrigger>Item</button>
				</h3>
				<brn-accordion-content>{{ probe() }}</brn-accordion-content>
			</div>
		</div>
	`,
})
class AccordionBlurDuringRenderSpec extends ProbeHost {}

@Component({
	imports: [BrnAccordion, BrnAccordionItem, BrnAccordionTrigger, BrnAccordionContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnAccordion>
			<div brnAccordionItem isOpened>
				<h3>
					<button brnAccordionTrigger>One</button>
				</h3>
				<brn-accordion-content>{{ probe() }}</brn-accordion-content>
			</div>
			<div brnAccordionItem>
				<h3>
					<button brnAccordionTrigger data-testid="other-trigger">Two</button>
				</h3>
				<brn-accordion-content>Two</brn-accordion-content>
			</div>
		</div>
	`,
})
class AccordionTriggerFocusDuringRenderSpec extends ProbeHost {}

// brn-accordion-content measured `firstChild`, which is a Text node whenever the
// projected content begins with a text node - the leading text below, or e.g. a
// template compiled with `preserveWhitespaces: true` where the indentation before
// the inner element survives as a Text node. measureDimensions then read `.style`
// off that Text node and threw "Cannot read properties of undefined (reading
// 'height')".
@Component({
	imports: [BrnAccordion, BrnAccordionItem, BrnAccordionTrigger, BrnAccordionContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnAccordion>
			<div brnAccordionItem isOpened>
				<h3>
					<button brnAccordionTrigger>Item</button>
				</h3>
				<brn-accordion-content>
					leading text
					<div>Body</div>
				</brn-accordion-content>
			</div>
		</div>
	`,
})
class AccordionContentLeadingTextNodeSpec {}

describe('BrnAccordion', () => {
	// #1371: disabling a focused child blurs it during CD, so the FocusMonitor emits mid-render.
	it('does not throw NG0600 when the focus monitor emits during change detection', async () => {
		const focusMonitor = new FakeFocusMonitor();

		const errors = await collectUnhandledErrors(async () => {
			const { fixture, detectChanges } = await render(AccordionBlurDuringRenderSpec, {
				providers: [{ provide: FocusMonitor, useValue: focusMonitor }],
			});

			// Focus first, then emit a blur (origin null) during the next render.
			focusMonitor.origin$.next('program');
			fixture.componentInstance.onRender = () => focusMonitor.origin$.next(null);
			fixture.componentInstance.armed.set(true);
			detectChanges();
		});

		expect(ng0600Errors(errors)).toEqual([]);
	});

	// Sibling of #1371: a trigger focused mid-render syncs CDK's key manager, which writes signals.
	it('does not throw NG0600 when a trigger receives focus during change detection', async () => {
		const errors = await collectUnhandledErrors(async () => {
			const { fixture, detectChanges } = await render(AccordionTriggerFocusDuringRenderSpec);

			const otherTrigger = screen.getByTestId('other-trigger');
			fixture.componentInstance.onRender = () => otherTrigger.dispatchEvent(new FocusEvent('focus'));
			fixture.componentInstance.armed.set(true);
			detectChanges();
		});

		expect(ng0600Errors(errors)).toEqual([]);
	});

	// brn-accordion-content must measure its first ELEMENT child, not its first
	// node: a leading Text node (e.g. from preserveWhitespaces) has no `.style`, so
	// measuring it threw "Cannot read properties of undefined (reading 'height')".
	it('does not throw when the opened content has a leading text node', async () => {
		const errors: unknown[] = [];
		await render(AccordionContentLeadingTextNodeSpec, {
			providers: [{ provide: ErrorHandler, useValue: { handleError: (error: unknown) => errors.push(error) } }],
		});
		// The dimension measuring runs in an afterNextRender hook that does not
		// auto-run under jest - flush it so the regression actually exercises.
		TestBed.inject(ApplicationRef).tick();

		expect(errors).toEqual([]);
	});
});
