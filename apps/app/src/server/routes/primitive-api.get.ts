import { defineEventHandler } from 'h3';
import docsData from '../../public/data/ui-api.json';

export default defineEventHandler(() => {
	return docsData;
});
