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

  // 注册代码建议提示，只有当按下" "或“/”时才触发
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

  context.subscriptions.push(
    vscode.languages.registerHoverProvider("typescript", new HoverProvider())
  );

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      ["typescript"],
      new DefinitionProvider()
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
