import { setupMatrix } from './matrix';

// Prints the per-PR matrix cell ids as a JSON array, so CI can fan each cell out to its own parallel job
// without hardcoding the list. Nightly-only cells are excluded - they are not in the PR matrix and the
// drift-guard checks against this list. Run with:
//   node -e "require('jiti')(process.cwd())('./apps/cli-smoke/src/list-cells')"
process.stdout.write(JSON.stringify(setupMatrix.filter((cell) => !cell.nightlyOnly).map((cell) => cell.id)));
