import * as vscode from "vscode";
import { isController } from "../common/util";
import getCustomInfo from "./custom";
import getTranslateInfo from "./translate";
/**
 * 注解中 interface的内容悬浮提示
 */
export default class HoverProvider {
  provideHover(document: vscode.TextDocument, position: vscode.Position) {
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

      let description = interfaceName.includes("/")
        ? getTranslateInfo(fileName, interfaceName)
        : getCustomInfo(fileName, interfaceName);
      return new vscode.Hover(description);
    }
  }
}
