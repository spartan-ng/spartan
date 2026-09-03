import { DEFAULT_CONFIG, encodePreset, type DesignSystemConfig } from '@spartan-ng/registry';

export function getPresetCode(config: DesignSystemConfig): string {
	return encodePreset({ ...DEFAULT_CONFIG, ...config });
}
