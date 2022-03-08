import * as vscode from "vscode";
import {
  provideCompletionCode,
  provideCompletionItems,
  resolveCompletionItem,
} from "./completion/index";

import HoverProvider from "./hover";
import DefinitionProvider from "./definition";

export function activate(context: vscode.ExtensionContext) {
  console.log("插件已经被激活");

  // 只有当按下" "或“/”时才触发自动补全
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "typescript",
      {
        provideCompletionItems,
        resolveCompletionItem,
      },
      "/",
      " "
    )
  );
  //输入@自动补全
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "typescript",
      {
        provideCompletionItems: provideCompletionCode,
        resolveCompletionItem,
      },
      "@"
    )
  );

  //悬停提示
  context.subscriptions.push(
    vscode.languages.registerHoverProvider("typescript", new HoverProvider())
  );

  //跳转到相应的interface
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      ["typescript"],
      new DefinitionProvider()
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
