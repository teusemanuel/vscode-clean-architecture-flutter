import * as changeCase from "change-case";

export function getPageTemplate (pageName: string, packagePath: string, blocType: 'bloc' | 'cubit'): string {
    const pascalCasePageName = changeCase.pascalCase(pageName.toLowerCase());
    const pascalCaseBlocType = changeCase.pascalCase(blocType.toLowerCase());
    const snakeCasePageName = changeCase.snakeCase(pageName).toLowerCase();
    const hyphenCasePageName = changeCase.paramCase(pageName.toLowerCase());
    return `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:${packagePath}/${blocType}/${snakeCasePageName}_${blocType}.dart';

class ${pascalCasePageName}Page extends StatelessWidget {
    static const path = '${hyphenCasePageName}';
    const ${pascalCasePageName}Page({Key? key}) : super(key: key);

    @override
    Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('${pascalCasePageName}')),
        body: BlocProvider(
            create: (_) => ${pascalCasePageName}${pascalCaseBlocType}.of(context),
            child: Container(),
        ));
    }
}
`;
}