import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { SourceLocation } from "../types";
import { AnalyzerParams } from "../analyzer";

export const inheritanceInsteadOfComposition = (
  params: AnalyzerParams
): SourceLocation[] => {
  if (!params.ast) return [];

  const { ast } = params;
  const locations: SourceLocation[] = [];

  traverse(ast as any, {
    ClassDeclaration(path) {
      const node = path.node;
      const decorators = node.decorators;
      if (!decorators || decorators.length === 0) return;

      const isAngularComponent = decorators.some((dec) => {
        if (!t.isCallExpression(dec.expression)) return false;
        const callee = dec.expression.callee;
        return (
          t.isIdentifier(callee) &&
          ["Component", "Directive", "Pipe"].includes(callee.name)
        );
      });

      if (!isAngularComponent) return;

      if (node.superClass && t.isIdentifier(node.superClass)) {
        const superName = node.superClass.name;
        const className = node.id?.name ?? "UnnamedClass";
        const line = node.loc?.start.line ?? undefined;

        locations.push({
          start: line,
          end: line,
          path: node.loc?.filename,
        });
      }
    }
  });

  return locations;
};