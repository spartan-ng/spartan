import * as d3 from 'd3';
import type { CurveType } from './types';

/**
 * Curve factory map for D3 line interpolation
 * Maps CurveType string values to D3 curve factory functions
 */
export const CURVE_MAP: Record<CurveType, d3.CurveFactory | d3.CurveBundleFactory> = {
	basis: d3.curveBasis,
	basisClosed: d3.curveBasisClosed,
	basisOpen: d3.curveBasisOpen,
	bundle: d3.curveBundle,
	cardinal: d3.curveCardinal,
	cardinalClosed: d3.curveCardinalClosed,
	cardinalOpen: d3.curveCardinalOpen,
	catmullRom: d3.curveCatmullRom,
	catmullRomClosed: d3.curveCatmullRomClosed,
	catmullRomOpen: d3.curveCatmullRomOpen,
	linear: d3.curveLinear,
	linearClosed: d3.curveLinearClosed,
	monotoneX: d3.curveMonotoneX,
	monotoneY: d3.curveMonotoneY,
	natural: d3.curveNatural,
	step: d3.curveStep,
	stepAfter: d3.curveStepAfter,
	stepBefore: d3.curveStepBefore,
};
