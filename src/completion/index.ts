import { readdirSync, existsSync } from "fs";
import * as vscode from "vscode";
import * as ts from "typescript";
import { isController, options } from "../common/util";

/**
 * 仅支持 request|response 后面自定义form或node_modules中的参数解析
 * @param document
 * @param position
 * @param token
 * @param context
 * @returns
 */
function provideCompletionItems(document, position, token, context) {
  const fileName = document.fileName;
  const controllerFile = isController(fileName);
  if (!controllerFile) {
    return;
  }
  const line = document.lineAt(position);

  // 只截取到光标位置为止，防止一些特殊情况
  const lineText: string = line.text.substring(0, position.character);
  const workspaceFolder = vscode.workspace.workspaceFolders[0];

  const workspaceRoot = workspaceFolder.uri.path;
  if (!workspaceRoot) {
    return;
  }
  let files = new Set();
  //针对request后面的在egg项目的typings/custom下对应的interface
  const reqOrresReg = /(@request|@response) /g;
  if (reqOrresReg.test(lineText)) {
    const fileName = document.fileName;
    if (!fileName) {
      return;
    }
    if (!lineText.includes("/")) {
      const dFileName = fileName
        .replace("app/controller", "typings/custom")
        .replace(".ts", ".d.ts");
      if (dFileName) {
        const program = ts.createProgram([dFileName], options);
        const sourceFile = program.getSourceFile(dFileName);
        ts.forEachChild(sourceFile, (moduleDeclaration: ts.Node) => {
          if (ts.isModuleDeclaration(moduleDeclaration)) {
            ts.forEachChild(moduleDeclaration, (moduleBlock: ts.Node) => {
              if (ts.isModuleBlock(moduleBlock)) {
                ts.forEachChild(
                  moduleBlock,
                  (interfaceDeclaration: ts.Node) => {
                    if (ts.isInterfaceDeclaration(interfaceDeclaration)) {
                      files.add(interfaceDeclaration.name.escapedText);
                    }
                  }
                );
              }
            });
          }
        });
      }
    }
    if (/\/$/g.test(lineText)) {
      //response后面中台bean提示
      const path = lineText.replace(reqOrresReg, "").replace("   * ", "");
      if (path) {
        let dFile = `${workspaceRoot}/node_modules/@${path}`;
        if (!existsSync(dFile)) {
          dFile = `${workspaceRoot}/node_modules/${path}`;
        }
        if (existsSync(dFile)) {
          let arr = readdirSync(dFile);
          if (arr && arr.length > 0) {
            files = new Set([...Array.from(files), ...arr]);
          }
        }
      }
    }
  }
  if (files && files.size > 0) {
    return Array.from(files).map((dep: string) => {
      return new vscode.CompletionItem(dep, vscode.CompletionItemKind.Field);
    });
  }
  return null;
}

/**
 * 提供path|query|request|response单词代码提示
 * @param document
 * @param position
 * @param token
 * @param context
 * @returns
 */
function provideCompletionCode(document, position, token, context) {
  const line = document.lineAt(position);

  // 只截取到光标位置为止，防止一些特殊情况
  const lineText: string = line.text.substring(0, position.character);
  const workspaceFolder = vscode.workspace.workspaceFolders[0];

  const workspaceRoot = workspaceFolder.uri.path;
  if (!workspaceRoot) {
    return;
  }
  if (lineText.endsWith("@")) {
    let files = ["path", "query", "request", "response"];
    return files.map((dep: string) => {
      return new vscode.CompletionItem(dep, vscode.CompletionItemKind.Field);
    });
  }
  return null;
}

/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item
 * @param {*} token
 */
function resolveCompletionItem(item, token) {
  return null;
}

export { resolveCompletionItem, provideCompletionCode, provideCompletionItems };
