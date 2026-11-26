import { migrateDrawer } from '../../migrate-drawer/generator';
import { scanDrawerMigration } from '../../migrate-drawer/utils';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const helmDrawerHealthcheck: Healthcheck = {
	name: 'Helm Drawer',
	async detect(tree, failure) {
		for (const [path, { issues }] of scanDrawerMigration(tree)) {
			for (const { message, fixable } of issues) {
				failure(`${path}: ${message}`, HealthcheckSeverity.Error, fixable);
			}
		}
	},
	fix: (tree, { angularCli }) => migrateDrawer(tree, { skipFormat: true, angularCli }),
	prompt:
		'Would you like to migrate the drawer? This regenerates the helm drawer, overwriting its customizations, and replaces `direction` with `swipeDirection` where it can.',
};
