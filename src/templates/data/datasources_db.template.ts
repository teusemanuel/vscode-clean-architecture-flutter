import * as changeCase from "change-case";
import { workspace } from "vscode";

export function getDatasourceDBTemplate(pageName: string, domainDirectoryPath: string): string {
	const useInjectable = workspace.getConfiguration("architecture").get<boolean>("useInjectable");
	return useInjectable
		? getInjectableDatasource(pageName, domainDirectoryPath)
		: getDatasource(pageName, domainDirectoryPath);
}

function getInjectableDatasource(pageName: string, domainDirectoryPath: string): string {
	const pascalCaseDatasourceName = changeCase.pascalCase(pageName);
	const snakeCaseDatasourceName = changeCase.snakeCase(pageName).toLowerCase();
	const pathCaseDatasourceName = changeCase.paramCase(pageName).toLowerCase();
	return `import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCaseDatasourceName}.dart';

@injectable
abstract class ${pascalCaseDatasourceName}ApiDatasource {
  @factoryMethod
  factory ${pascalCaseDatasourceName}ApiDatasource(Dio dio, {@factoryParam String? baseUrl}) = _${pascalCaseDatasourceName}ApiDatasource;

  @GET('${pathCaseDatasourceName}')
  Future<${pascalCaseDatasourceName}> get();
}
`;
}

function getDatasource(pageName: string, domainDirectoryPath: string): string {
	const pascalCaseDatasourceName = changeCase.pascalCase(pageName);
	const snakeCaseDatasourceName = changeCase.snakeCase(pageName).toLowerCase();
	const pathCaseDatasourceName = changeCase.paramCase(pageName).toLowerCase();
	return `import 'package:dio/dio.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCaseDatasourceName}.dart';

abstract class ${pascalCaseDatasourceName}ApiDatasource {
  factory ${pascalCaseDatasourceName}ApiDatasource(Dio dio, {String? baseUrl}) = _${pascalCaseDatasourceName}ApiDatasource;

  @GET('${pathCaseDatasourceName}')
  Future<${pascalCaseDatasourceName}> get();
}
`;
}