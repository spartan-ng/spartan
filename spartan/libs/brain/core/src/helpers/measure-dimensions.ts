export type MeasurementDisplay = 'block' | 'inline-block' | 'flex' | 'grid' | 'table' | 'contents' | (string & {});

export const measureDimensions = (elementToMeasure: HTMLElement, measurementDisplay: MeasurementDisplay) => {
	const previousHeight = elementToMeasure.style.height;
	const previousDisplay = elementToMeasure.style.display;
	const previousHidden = elementToMeasure.hidden;

	elementToMeasure.hidden = false;
	elementToMeasure.style.height = 'auto';
	elementToMeasure.style.display = previousDisplay === 'hidden' ? measurementDisplay : previousDisplay;

	const { width, height } = elementToMeasure.getBoundingClientRect();

	elementToMeasure.hidden = previousHidden;
	elementToMeasure.style.display = previousDisplay;
	elementToMeasure.style.height = previousHeight;

	return { width, height };
};
