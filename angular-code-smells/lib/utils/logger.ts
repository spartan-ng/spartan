import { AnalysisOutput } from "../analyzer";
import path from "path";

type SmellAbbreviation =
  | "DOM"
  | "IIC"
  | "LC"
  | "ANY"
  | "TMI"
  | "LF"
  | "EPC"

const smellsMap: Record<string, SmellAbbreviation> = {
  overusingAnyType: "ANY",
  inheritanceInsteadOfComposition: "IIC",
  largeComponent: "LC",
  directDomManipulation: "DOM",
  tooManyInputs: "TMI",
  largeFile: "LF",
  excessiveParentToChild: "EPC"
}

type SmellAnalysis = {
  [key in SmellAbbreviation]?: number | string;
}

type LoggerOutput = {
  file: string;
} & SmellAnalysis

export const logger = (analyzeOutput: AnalysisOutput[]) => {
  const smellsOutput: LoggerOutput[] = [];

  analyzeOutput.forEach((output) => {
    const pathToFile = Object.keys(output)[0];
    const smells = output[pathToFile];

    const analysisData: SmellAnalysis = Object.fromEntries(
      Object.entries(smells).map(([key, value]) => [
        smellsMap[key],
        (Array.isArray(value) && value.length > 0 ? 1 : 0),
      ])
    );

    const outputEntry: LoggerOutput = {
      file: path.relative(process.cwd(), pathToFile),
      ...analysisData
    }

    if(Object.values(analysisData).some(value => value === 1 || value === "Y")) {
      smellsOutput.push(outputEntry);
    }
  });

  return smellsOutput;
}