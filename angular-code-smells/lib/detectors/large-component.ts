import { AnalyzerParams } from "../analyzer";
import { SourceLocation } from "../types";
import traverse from "@babel/traverse";
import {
  isDecorator,
  ObjectExpression,
} from "@babel/types";
import path from "path";
import fs from "fs";

export const largeComponent = (
  params: AnalyzerParams,
  threshold: number = 140
): SourceLocation[] => {
  if (!params.ast) return [];

  const { ast, file } = params;
  const smells: SourceLocation[] = [];

  traverse(ast, {
    ClassDeclaration(pathClass) {
      const node = pathClass.node;

      const decorator = node.decorators?.find(
        (d) =>
          isDecorator(d) &&
          d.expression.type === "CallExpression" &&
          d.expression.callee.type === "Identifier" &&
          d.expression.callee.name === "Component"
      );

      if (!decorator) return;

      const args = decorator.expression.type === "CallExpression"
        ? decorator.expression.arguments
        : [];

      if (args.length === 0 || args[0].type !== "ObjectExpression") return;

      const componentConfig = args[0] as ObjectExpression;

      let templateLines = 0;

      const templateProp = componentConfig.properties.find(
        (prop) =>
          prop.type === "ObjectProperty" &&
          prop.key.type === "Identifier" &&
          prop.key.name === "template"
      );

      if (templateProp && templateProp.type === "ObjectProperty") {
        const value = templateProp.value;

        if (value.type === "StringLiteral") {
          templateLines = (value.value.match(/\n/g) || []).length + 1;
        }

        if (value.type === "TemplateLiteral") {
          const raw = value.quasis.map((q) => q.value.raw).join("");
          templateLines = (raw.match(/\n/g) || []).length + 1;
        }
      }

      const templateUrlProp = componentConfig.properties.find(
        (prop) =>
          prop.type === "ObjectProperty" &&
          prop.key.type === "Identifier" &&
          prop.key.name === "templateUrl"
      );

      if (templateUrlProp && templateUrlProp.type === "ObjectProperty") {
        const value = templateUrlProp.value;

        if (value.type === "StringLiteral") {
          const componentDir = path.dirname(file.path);
          const templatePath = path.resolve(componentDir, value.value);

          try {
            const html = fs.readFileSync(templatePath, "utf8");
            templateLines = html.split("\n").length;
          } catch (e) {
          }
        }
      }

      const classLines = node.loc
        ? node.loc.end.line - node.loc.start.line
        : 0;

      const total = classLines + templateLines;

      if (total > threshold) {
        smells.push({
          start: node.loc?.start.line ?? 1,
          end: node.loc?.end.line ?? classLines,
          path: file.path,
        });
      }
    },
  });

  return smells;
};
