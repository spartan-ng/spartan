import traverse from "@babel/traverse";
import { AnalyzerParams } from "../analyzer";
import { SourceLocation } from "../types";
import { isDecorator } from "@babel/types";

export const excessiveParentToChild = (
  params: AnalyzerParams,
  threshold: number = 2
): SourceLocation[] => {
  if (!params.ast) return [];

  const { ast } = params;
  const results: SourceLocation[] = [];

  let childVarName: string | null = null;

  traverse(ast, {
    ClassProperty(path) {
      const decorators = path.node.decorators ?? [];

      const viewChildDecorator = decorators.find(
        (d) =>
          isDecorator(d) &&
          d.expression.type === "CallExpression" &&
          d.expression.callee.type === "Identifier" &&
          d.expression.callee.name === "ViewChild"
      );

      if (viewChildDecorator) {
        if (path.node.key.type === "Identifier") {
          childVarName = path.node.key.name;
        }
      }
    },

    CallExpression(path) {
      if (!childVarName) return;

      const callee = path.node.callee;

      if (
        callee.type === "MemberExpression" &&
        callee.object.type === "MemberExpression" &&
        callee.object.object.type === "ThisExpression" &&
        callee.object.property.type === "Identifier" &&
        callee.object.property.name === childVarName
      ) {
        results.push({
          start: path.node.loc?.start.line,
          end: path.node.loc?.end.line,
          path: path.node.loc?.filename,
        });
      }
    },
  });

  if (results.length >= threshold) return results;

  return [];
};
