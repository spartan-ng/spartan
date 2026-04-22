import { lastValueFrom } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { tweenTo } from './tween';

describe('tweenTo', () => {
	it('emits `to` immediately when duration is zero', async () => {
		const values = await lastValueFrom(tweenTo(0, 100, { ease: 'easeOut', duration: 0 }).pipe(toArray()));
		expect(values).toEqual([100]);
	});

	it('emits `to` immediately when from equals to', async () => {
		const values = await lastValueFrom(tweenTo(50, 50, { ease: 'easeOut', duration: 0.2 }).pipe(toArray()));
		expect(values).toEqual([50]);
	});

	it('ends exactly on `to` for any non-zero duration', async () => {
		const values = await lastValueFrom(tweenTo(0, 200, { ease: 'easeOut', duration: 0.05 }).pipe(toArray()));
		expect(values[values.length - 1]).toBe(200);
	});

	it('emits monotonically toward `to` with easeOut', async () => {
		const values = await lastValueFrom(tweenTo(0, 100, { ease: 'easeOut', duration: 0.05 }).pipe(toArray()));
		for (let i = 1; i < values.length; i++) {
			expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]!);
		}
	});

	it('emits monotonically toward `to` with linear easing', async () => {
		const values = await lastValueFrom(tweenTo(0, 100, { ease: 'linear', duration: 0.05 }).pipe(toArray()));
		for (let i = 1; i < values.length; i++) {
			expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]!);
		}
	});

	it('handles descending direction (from > to)', async () => {
		const values = await lastValueFrom(tweenTo(100, 0, { ease: 'easeOut', duration: 0.05 }).pipe(toArray()));
		for (let i = 1; i < values.length; i++) {
			expect(values[i]).toBeLessThanOrEqual(values[i - 1]!);
		}
		expect(values[values.length - 1]).toBe(0);
	});
});
