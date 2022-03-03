import * as ts from "typescript";
import { getType, options } from "./util";
import * as fs from "fs";
import { MarkdownString } from "vscode";

/**
 * 获取声明文件路径
 * @param fileName
 * @param interfaceName
 * @param type
 * @returns
 */
function getDfilePath(fileName, interfaceName, type) {
  const arr = fileName.split("app/controller/");
  const rootPath = arr[0];
  const dFileName = arr[1].substring(0, arr[1].lastIndexOf("."));
  let dFile = "";
  if (type === "custom") {
    dFile = `${rootPath}typings/custom/${dFileName}.d.ts`;
  } else {
    dFile = `${rootPath}node_modules/${interfaceName}`;
    if (!fs.existsSync(dFile)) {
      dFile = `${rootPath}node_modules/@${interfaceName}`;
    }
  }

  if (!fs.existsSync(dFile)) {
    return null;
  }

  return dFile;
}

/**
 * 根据文件路径获取该文件的ast信息
 * @param dFile
 * @returns
 */
function getSourceFile(dFile: string) {
  const program = ts.createProgram([dFile], options);
  const sourceFile = program.getSourceFile(dFile);
  return sourceFile;
}

/**
 * 获取 interfaceName所在文件的ast信息
 * @param fileName
 * @param interfaceName
 * @param type
 * @returns
 */
function getInterfaceDeclaration(
  fileName: string,
  interfaceName: string,
  type: string
) {
  const dFile = getDfilePath(fileName, interfaceName, type);
  const sourceFile = getSourceFile(dFile);
  let result = null;
  ts.forEachChild(sourceFile, (declaration) => {
    if (ts.isModuleDeclaration(declaration)) {
      ts.forEachChild(declaration, (block) => {
        if (ts.isModuleBlock(block)) {
          ts.forEachChild(block, (interfaceDeclaration) => {
            if (ts.isInterfaceDeclaration(interfaceDeclaration)) {
              const interfaceDeclarationName = interfaceDeclaration.name
                .escapedText as string;
              if (
                interfaceDeclarationName === interfaceName ||
                interfaceName.endsWith(
                  `${interfaceDeclarationName.substring(
                    1,
                    interfaceDeclarationName.length
                  )}.d.ts`
                )
              ) {
                result = interfaceDeclaration;
              }
            }
          });
        }
      });
    }
  });

  return result;
}

/**
 * 获取interface里的内容信息
 * @param interfaceDeclaration
 * @returns
 */
function getDesc(interfaceDeclaration) {
  let description = null;
  if (interfaceDeclaration) {
    description = new MarkdownString();
    ts.forEachChild(interfaceDeclaration, (property: any) => {
      if (ts.isPropertySignature(property)) {
        let desc = "";
        ts.forEachChild(property, (item) => {
          if (ts.isIdentifier(item)) {
            desc += item.escapedText;
          } else if (ts.SyntaxKind.QuestionToken === item.kind) {
            desc += "?";
          } else {
            desc += `: ${getType(item.kind)};`;
          }
        });
        const { jsDoc = [] } = property as any;
        if (jsDoc && jsDoc.length > 0 && jsDoc[0].comment) {
          desc = `${desc} //${jsDoc[0].comment}`;
        }
        if (desc) {
          description.appendMarkdown(`${desc}<br/>`);
        }
      }
    });
    description.supportHtml = true;
    description.supportThemeIcons = true;
  }

  return description;
}

export { getDfilePath, getSourceFile, getInterfaceDeclaration, getDesc };
