export * from './generators/base/lib/styles';
export * from './generators/migrate-brain-imports/generator';
// Consumed by the docs app's `generate-hlm-component-preview` tools generator to produce the exact
// CLI output for a StackBlitz project. Imported via the package scope (not a relative cross-project
// path) so the tools build does not pull CLI sources outside its rootDir (TS6059). The tools test
// env polyfills TextDecoder for the @nx/angular graph this transitively loads.
export { createPrimitiveLibraries } from './generators/ui/generator';
export { loadOrInitConfig } from './utils/config';
export { STYLES, type Style } from './utils/supported-styles';
