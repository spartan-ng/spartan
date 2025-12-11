import {
  isDecorator,
  isClassProperty,
} from "@babel/types";
import traverse from "@babel/traverse";
import { SourceLocation } from "../types";
import { AnalyzerParams } from "../analyzer";

export const tooManyInputs = (
  params: AnalyzerParams, 
  threshold: number = 8
): SourceLocation[] => {
  if (!params.ast) return [];

  const { ast } = params;
  const tooMany: SourceLocation[] = [];

  traverse(ast, {
    ClassDeclaration(path) {
      const node = path.node;

      const hasComponentDecorator =
        node.decorators?.some(
          (decorator) =>
            isDecorator(decorator) &&
            decorator.expression.type === "CallExpression" &&
            decorator.expression.callee.type === "Identifier" &&
            decorator.expression.callee.name === "Component"
        ) ?? false;

      if (!hasComponentDecorator) return;

      let inputCount = 0;

      node.body.body.forEach((member) => {
        if (!isClassProperty(member) || !member.decorators) return;

        const hasInputDecorator = member.decorators.some(
          (decorator) =>
            isDecorator(decorator) &&
            decorator.expression.type === "CallExpression" &&
            decorator.expression.callee.type === "Identifier" &&
            decorator.expression.callee.name === "Input"
        );

        if (hasInputDecorator) {
          inputCount++;
        }
      });

      if (inputCount > threshold) {
        tooMany.push({
          start: node.loc?.start.line,
          end: node.loc?.end.line,
          path: node.loc?.filename,
        });
      }
    },
  });

  return tooMany;
};
