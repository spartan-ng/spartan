import { Primitive } from './primitives';

export interface HlmUIGeneratorSchema {
	name?: Primitive;
	directory?: string;
	rootProject?: boolean;
	tags?: string;
}
