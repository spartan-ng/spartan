import { readFileSync } from 'fs';

export const load = async () => {
	const spartanPreset = readFileSync(`./libs/brain/hlm-tailwind-preset.css`, 'utf-8');

	return { spartanPreset };
};
