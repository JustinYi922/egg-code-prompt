import { getDesc, getInterfaceDeclaration } from "../common";
/**
 *
 * @param fileName controller所在的文件地址
 * @param interfaceName controller名称（也是自定义的custom下声明文件的名称）
 * @returns
 */
export default function getInfo(fileName: string, interfaceName: string) {
  const interfaceDeclaration: any = getInterfaceDeclaration(
    fileName,
    interfaceName,
    "custom"
  );
  if (!interfaceDeclaration) {
    return;
  }
  let description = getDesc(interfaceDeclaration);

  return description;
}
