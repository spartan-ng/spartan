import { AnalyzerParams } from "../analyzer";
import { SourceLocation } from "../types";

export const largeFile = (
  params: AnalyzerParams,
  threshold: number = 240
): SourceLocation[] => {
  const { file } = params;

  const lines = file.content.split("\n").length;

  if (lines > threshold) {
    return [{
      start: 1,
      end: lines,
      path: file.path
    }];
  }

  return [];
};
