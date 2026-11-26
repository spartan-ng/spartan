// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import { clamp } from './dom';

/**
 * A snap point: a fraction of the viewport height (`0`-`1`), a pixel number (`> 1`), or a
 * `px`/`rem` string.
 */
export type BrnDrawerSnapPoint = number | string;

export interface ResolvedDrawerSnapPoint {
	value: BrnDrawerSnapPoint;
	height: number;
	offset: number;
}

export function getSnapPointSwipeMovement(baseOffset: number, movementValue: number): number {
	const nextOffset = baseOffset + movementValue;
	if (nextOffset >= 0) return movementValue;
	return -Math.sqrt(-nextOffset) - baseOffset;
}

export function resolveSnapPointValue(
	snapPoint: BrnDrawerSnapPoint,
	viewportHeight: number,
	rootFontSize: number,
): number | null {
	if (!Number.isFinite(viewportHeight) || viewportHeight <= 0) return null;

	if (typeof snapPoint === 'number') {
		if (!Number.isFinite(snapPoint)) return null;
		return snapPoint <= 1 ? clamp(snapPoint, 0, 1) * viewportHeight : snapPoint;
	}

	const trimmed = snapPoint.trim();
	if (trimmed.endsWith('px')) {
		const value = Number.parseFloat(trimmed);
		return Number.isFinite(value) ? value : null;
	}
	if (trimmed.endsWith('rem')) {
		const value = Number.parseFloat(trimmed);
		return Number.isFinite(value) ? value * rootFontSize : null;
	}
	return null;
}

export function closestSnapPointIndex(values: number[], target: number): number {
	let closestIndex = -1;
	let closestDistance = Infinity;
	for (let index = 0; index < values.length; index += 1) {
		const distance = Math.abs(values[index] - target);
		if (distance < closestDistance) {
			closestDistance = distance;
			closestIndex = index;
		}
	}
	return closestIndex;
}

export function resolveSnapPoints(
	snapPoints: readonly BrnDrawerSnapPoint[] | undefined,
	popupHeight: number,
	viewportHeight: number,
	rootFontSize: number,
): ResolvedDrawerSnapPoint[] {
	if (!snapPoints || snapPoints.length === 0 || viewportHeight <= 0 || popupHeight <= 0) return [];

	const maxHeight = Math.min(popupHeight, viewportHeight);
	const resolved = snapPoints
		.map((value): ResolvedDrawerSnapPoint | null => {
			const resolvedHeight = resolveSnapPointValue(value, viewportHeight, rootFontSize);
			if (resolvedHeight === null) return null;
			const height = clamp(resolvedHeight, 0, maxHeight);
			return { value, height, offset: Math.max(0, popupHeight - height) };
		})
		.filter((point): point is ResolvedDrawerSnapPoint => Boolean(point));

	if (resolved.length <= 1) return resolved;

	// Drop points that resolve to (almost) the same height, keeping the last one.
	const deduped: ResolvedDrawerSnapPoint[] = [];
	const seenHeights: number[] = [];
	for (let index = resolved.length - 1; index >= 0; index -= 1) {
		const point = resolved[index];
		if (seenHeights.some((height) => Math.abs(height - point.height) <= 1)) continue;
		seenHeights.push(point.height);
		deduped.push(point);
	}
	return deduped.reverse();
}

export function resolveActiveSnapPoint(
	activeSnapPoint: BrnDrawerSnapPoint | null,
	resolvedSnapPoints: ResolvedDrawerSnapPoint[],
	popupHeight: number,
	viewportHeight: number,
	rootFontSize: number,
): ResolvedDrawerSnapPoint | undefined {
	if (activeSnapPoint === null) return undefined;

	const exactMatch = resolvedSnapPoints.find((point) => Object.is(point.value, activeSnapPoint));
	if (exactMatch) return exactMatch;

	const resolvedHeight = resolveSnapPointValue(activeSnapPoint, viewportHeight, rootFontSize);
	if (resolvedHeight === null) return undefined;

	const height = clamp(resolvedHeight, 0, Math.min(popupHeight, viewportHeight));
	return resolvedSnapPoints[
		closestSnapPointIndex(
			resolvedSnapPoints.map((point) => point.height),
			height,
		)
	];
}
