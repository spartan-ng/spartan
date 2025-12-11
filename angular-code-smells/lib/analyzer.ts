import { ParseResult } from "@babel/parser";
import { File } from "@babel/types";
import { readFiles } from "./utils/file-reader";
import { parseAST } from "./utils/parser";
import { SourceLocation, TSXFile } from "./types";

import { directDomManipulation } from "./detectors/direct-dom-manipulation";
import { 
  inheritanceInsteadOfComposition
} from "./detectors/inheritance-instead-of-composition";
import { largeComponent } from "./detectors/large-component";
import { overusingAnyType } from "./detectors/overusing-any-type";
import { tooManyInputs } from "./detectors/too-many-inputs";
import { largeFile } from "./detectors/large-file";
import { excessiveParentToChild } from "./detectors/excessive-parent-to-child-communication";

export type AnalysisOutput = {
  [key: string]: {
    [K in keyof Analyzers]: ReturnType<Analyzers[K]>;
  }
}

export type AnalyzerParams = {
  ast: ParseResult<File> | null;
  file: TSXFile;
};

export type AnalyzerFunction<T> = (params: AnalyzerParams) => T;

type Analyzers = {
  [key: string]: AnalyzerFunction<SourceLocation[]>;
}

export const analyzeFile = (file: TSXFile): AnalysisOutput => {
  const ast = parseAST(file);

  const params: AnalyzerParams = {
    ast,
    file
  };

  const analyzers: Analyzers = {
    directDomManipulation,
    inheritanceInsteadOfComposition,
    largeComponent,
    overusingAnyType,
    tooManyInputs,
    largeFile,
    excessiveParentToChild
  };

  return {
    [file.path]: Object.fromEntries(
      Object.entries(analyzers).map(([key, analyzer]) => [
        key,
        analyzer(params)
      ])
    )
  };
};

export const analyze = async (path: string) => {
  const analysis: AnalysisOutput[] = [];

  for (const file of await readFiles(path)) {
    analysis.push(analyzeFile(file));
  }

  return analysis;
}