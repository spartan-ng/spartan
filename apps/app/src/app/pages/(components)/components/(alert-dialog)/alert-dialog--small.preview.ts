import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-alert-dialog-small',
	imports: [HlmAlertDialogImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-alert-dialog>
			<button hlmAlertDialogTrigger hlmBtn variant="outline">Show Dialog</button>
			<hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx" size="sm">
				<hlm-alert-dialog-header>
					<h2 hlmAlertDialogTitle>Allow accessory to connect?</h2>
					<p hlmAlertDialogDescription>Do you want to allow the USB accessory to connect to this device?</p>
				</hlm-alert-dialog-header>
				<hlm-alert-dialog-footer>
					<button hlmAlertDialogCancel>Don't allow</button>
					<button hlmAlertDialogAction>Allow</button>
				</hlm-alert-dialog-footer>
			</hlm-alert-dialog-content>
		</hlm-alert-dialog>
	`,
})
export class AlertDialogSmall {}
