import { TextDecoder, TextEncoder } from 'node:util';

// Some tools generators import the CLI generators, which transitively load @nx/angular ->
// @nx/module-federation -> @rspack/core. Those reference TextEncoder/TextDecoder at module load,
// but jest's test environment does not always define them. Provide them before any test module
// is imported so those modules can be loaded under jest.
globalThis.TextDecoder ??= TextDecoder as unknown as typeof globalThis.TextDecoder;
globalThis.TextEncoder ??= TextEncoder as unknown as typeof globalThis.TextEncoder;
