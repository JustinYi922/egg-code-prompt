import * as ts from "typescript";
import { isNotBlank } from "../common/util";
import * as fs from "fs";
import { MarkdownString } from "vscode";
import { getDesc, getDfilePath, getSourceFile } from "../common";

/**
 * 解析第三方依赖包中声明文件中的interfaceName内容信息
 * @param fileName
 * @param interfaceName
 * @returns
 */
export default function getInfo(fileName, interfaceName) {
  const dFile = getDfilePath(fileName, interfaceName, "");

  if (!fs.existsSync(dFile)) {
    return;
  }

  const sourceFile = getSourceFile(dFile);
  let description = new MarkdownString();
  ts.forEachChild(sourceFile, (declaration) => {
    const desc = getDesc(declaration);
    if (desc && isNotBlank(desc.value)) {
      description = desc;
    }
  });

  return description;
}
