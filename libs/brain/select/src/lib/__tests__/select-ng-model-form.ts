import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrnSelectImports } from '../../index';

@Component({
	selector: 'select-ngmodel-form',
	imports: [ReactiveFormsModule, FormsModule, JsonPipe, BrnSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form ngForm>
			<div class="mb-3">
				<pre>Form Control Value: {{ fruit() | json }}</pre>
			</div>
			<brn-select class="w-56" [(ngModel)]="fruit" name="fruit" #select="brnSelect">
				<label>Select a Fruit</label>
				<input brnSelectTrigger cdk-overlay-origin #trigger="cdkOverlayOrigin" (click)="select.toggle()" />

				<ng-template
					cdk-connected-overlay
					cdkConnectedOverlayLockPosition
					cdkConnectedOverlayHasBackdrop
					cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
					[cdkConnectedOverlayOrigin]="trigger"
					[cdkConnectedOverlayOpen]="select._delayedExpanded()"
					[cdkConnectedOverlayPositions]="select._positions"
					[cdkConnectedOverlayWidth]="select.triggerWidth() > 0 ? select.triggerWidth() : 'auto'"
					(backdropClick)="select.hide()"
					(detach)="select.hide()"
					(positionChange)="select._positionChanges$.next($event)"
				>
				<brn-select-content>
					<div brnSelectLabel>Fruits</div>
					<div brnOption value="apple">Apple</div>
					<div brnOption value="banana">Banana</div>
					<div brnOption value="blueberry">Blueberry</div>
					<div brnOption value="grapes">Grapes</div>
					<div brnOption value="pineapple">Pineapple</div>
				</brn-select-content>
				</ng-template>

			</brn-select>
		</form>
	`,
})
export class SelectNgModel {
	public readonly fruit = signal('');
}
