import { isController, getLineNumByPos } from "../common/util";
import * as vscode from "vscode";
import * as fs from "fs";
import {
  getDfilePath,
  getInterfaceDeclaration,
  getSourceFile,
} from "../common";

export default class Definition implements vscode.DefinitionProvider {
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
    const fileName = document.fileName;
    const controllerFile = isController(fileName);
    if (!controllerFile) {
      return;
    }
    const line = document.lineAt(position);
    const word: string = line.text;

    //只考虑@request和@response后面的bean
    //过滤基本类型参数查找
    if (/\@re/g.test(word)) {
      const arr = word.split("@re")[1].split(" ");
      //`@request name string 测试name` 这种类型过滤
      if (arr.length > 2) {
        return;
      }
      //bean名称
      const interfaceName = arr[1];

      let destPath = "";
      let line = 0;
      let character = 0;
      //文件类型
      let type = interfaceName.endsWith(".d.ts") ? "" : "custom";
      destPath = getDfilePath(fileName, interfaceName, type);

      if (destPath && fs.existsSync(destPath)) {
        const sourceFile = getSourceFile(destPath);
        const interfaceDeclaration = getInterfaceDeclaration(
          fileName,
          interfaceName,
          type
        );
        if (interfaceDeclaration !== null) {
          line = getLineNumByPos(sourceFile.text, interfaceDeclaration.pos) + 1;
        }
        return new vscode.Location(
          vscode.Uri.file(destPath),
          new vscode.Position(line, character)
        );
      }
    }
  }
}
