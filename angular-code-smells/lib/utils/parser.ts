import { parse, ParseResult } from "@babel/parser";
import { TSXFile } from "../types";
import { File } from "@babel/types";

export function parseAST(file: TSXFile): ParseResult<File> | null {
  if (!file.path.endsWith(".ts")) {
    return null;
  }

  return parse(file.content, {
    sourceType: "module",
    sourceFilename: file.path,
    plugins: ["typescript", "decorators-legacy", "classProperties"],
  });
}