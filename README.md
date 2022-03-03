# egg-code-prompt
egg项目代码提示vscode插件

## 背景

BFF的开发童鞋给前端童鞋提供接口文档是主要的工作内容之一。在java的项目中，通过swagger的插件配合Yapi可以快速生成。但node项目一直没有，苦了node的BFFer了。所以开发此插件目的
* 配合ts-egg-swagger根据相应的规范快速生成接口文档
* 支持对关键单词的代码自动补全
* 支持对定义的form悬停提示其内容
* 支持对关键词后面的"类"跳转到定义

## 安装插件
vscode 插件中搜索egg-code-prompt

## 使用说明
请在使用TypeScript的Egg主目录中运行
### egg项目中，我们约定

1. app/controller ------controller目录
2. typings/custom -------自定义ts的声明文件目录（注意：d.ts文件名和controller中的文件名一致）
3. node_modules 下面有ts声明文件的依赖包,比如@qianmi/......../**.d.ts

### 在插件中我们提前生成了代码片段

在controller中
    1. 输入doc可以快速生成代码注释
    2. 输入pub可以快速生成模板方法+注释
    3. 输入puba可以生成异步方法+注释

### 插件使用

方法注释生成后【@request】再输入【空格】就会自动提示typings/custom下面的提前写好的声明
, 或者注解输入node_modules下面的文件目录名称，然后依次输入/就会继续寻找下一级目录

## 插件打包和发布
```node
    
    vsce package
    
    vsce publish
```