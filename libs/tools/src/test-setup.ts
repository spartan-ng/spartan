import { TextDecoder, TextEncoder } from 'node:util';

// Some tools generators import the CLI generators, which transitively load @nx/angular ->
// @nx/module-federation -> @rspack/core. Those reference TextEncoder/TextDecoder at module load;
// define them up front (idempotently) before any test module is imported so those modules load
// cleanly regardless of when the test environment provides the globals.
globalThis.TextDecoder ??= TextDecoder as unknown as typeof globalThis.TextDecoder;
globalThis.TextEncoder ??= TextEncoder as unknown as typeof globalThis.TextEncoder;
