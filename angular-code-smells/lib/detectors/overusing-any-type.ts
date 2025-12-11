import { isTSAnyKeyword } from "@babel/types";
import traverse from "@babel/traverse";
import { SourceLocation } from "../types";
import { AnalyzerParams } from "../analyzer";

export const overusingAnyType = (
  params: AnalyzerParams, 
  threshold: number = 2
): SourceLocation[] => {
  if (!params.ast) return [];

  const { ast } = params;
  const anyOccurrences: SourceLocation[] = [];

  traverse(ast, {
    enter(path) {
      if (isTSAnyKeyword(path.node)) {
        anyOccurrences.push({
          start: path.node.loc?.start.line,
          end: path.node.loc?.end.line,
          path: path.node.loc?.filename,
        });
      }
    },
  });

  if (anyOccurrences.length > threshold) {
    return anyOccurrences;
  }

  return [];
};
