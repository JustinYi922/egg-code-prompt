import * as ts from "typescript";
function isNotBlank(o: string | any) {
  return o && o.length > 0;
}
/**
 * 是否是controller类
 * 根据eggjs中文件目录这么判断
 * @param fileName 文件路径
 * @returns
 */
function isController(fileName: string) {
  return /\/app\/controller\//.test(fileName);
}

const options = {
  target: ts.ScriptTarget.ES2019,
  kind: ts.ScriptKind.TS,
  module: ts.ModuleKind.CommonJS,
};

/**
 * 根据ts的类型枚举返回ts的类型
 * @param kind
 * @returns
 */
function getType(kind: ts.SyntaxKind) {
  switch (kind) {
    case ts.SyntaxKind.StringKeyword:
      return "string";
    case ts.SyntaxKind.NumberKeyword:
      return "number";
    case ts.SyntaxKind.ArrayType:
      return "array";
    case ts.SyntaxKind.AnyKeyword:
      return "any";
    default:
      return "object";
  }
}

/**
 * 根据pos获取所在行数
 * @param fileContent
 * @param pos
 * @returns
 */
const getLineNumByPos = (fileContent, pos) => {
  const contentBefore = fileContent.slice(0, pos);
  // 统计有多少个换行符
  return (contentBefore.match(/\n/g) || []).length + 1;
};

export { isController, options, getType, isNotBlank, getLineNumByPos };
