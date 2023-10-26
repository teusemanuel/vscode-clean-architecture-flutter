import * as changeCase from "change-case";
import * as path from "path";
import { BlocTemplateType, getPackageName } from "../../utils";
import { workspace } from "vscode";

export function getPageTemplate(pageName: string, packagePath: string, blocType: BlocTemplateType): Promise<string> {
  const useInjectable = workspace.getConfiguration("architecture").get<boolean>("useInjectable");
  return useInjectable
    ? getInjectablePage(pageName, packagePath, blocType)
    : getDefaultPage(pageName, packagePath, blocType);
}

async function getInjectablePage(pageName: string, packagePath: string, blocType: BlocTemplateType): Promise<string> {
  const pascalCasePageName = changeCase.pascalCase(pageName);
  const blocTypeLower = `${blocType}`.toLowerCase();
  const packageName = await getPackageName();
  const injectionPath = workspace.getConfiguration("architecture").get<string>("injectionFile.path") || 'core/injection/injection.dart';
  const libNormalized = path.normalize("/lib/");
  const appPath = packagePath.substring(packagePath.lastIndexOf(libNormalized) + libNormalized.length, packagePath.lastIndexOf(path.normalize("/page")));
  const snakeCasePageName = changeCase.snakeCase(pageName).toLowerCase();
  const hyphenCasePageName = changeCase.paramCase(pageName.toLowerCase());

  return `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:${packageName}/${appPath}/${blocTypeLower}/${snakeCasePageName}_${blocTypeLower}.dart';
import 'package:${packageName}/${injectionPath}';

class ${pascalCasePageName}Page extends StatelessWidget {
  static const path = '/${hyphenCasePageName}';
  const ${pascalCasePageName}Page({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text('${pascalCasePageName}')),
    body: BlocProvider(
      create: (_) => getIt<${pascalCasePageName}${blocType}>(),
      child: Container(),
    ));
  }
}
`;
}

async function getDefaultPage(pageName: string, packagePath: string, blocType: BlocTemplateType): Promise<string> {
  const pascalCasePageName = changeCase.pascalCase(pageName);
  const libNormalized = path.normalize("/lib/");
  const appPath = packagePath.substring(packagePath.lastIndexOf(libNormalized) + libNormalized.length, packagePath.lastIndexOf(path.normalize("/page")));
  const packageName = await getPackageName();
  const snakeCasePageName = changeCase.snakeCase(pageName).toLowerCase();
  const hyphenCasePageName = changeCase.paramCase(pageName.toLowerCase());
  return `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:${packageName}/${appPath}/${blocType}/${snakeCasePageName}_${blocType}.dart';

class ${pascalCasePageName}Page extends StatelessWidget {
    static const path = '/${hyphenCasePageName}';
    const ${pascalCasePageName}Page({Key? key}) : super(key: key);

    @override
    Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('${pascalCasePageName}')),
        body: BlocProvider(
            create: (_) => ${pascalCasePageName}${blocType}.of(context),
            child: Container(),
        ));
    }
}
`;
}