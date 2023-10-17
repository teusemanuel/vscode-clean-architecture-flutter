import * as changeCase from "change-case";
import { workspace } from "vscode";

export function getDatasourceAPITemplate(pageName: string, domainDirectoryPath: string): string {
	const useInjectable = workspace.getConfiguration("architecture").get<boolean>("useInjectable");
	return useInjectable
		? getInjectableDatasource(pageName, domainDirectoryPath)
		: getDatasource(pageName, domainDirectoryPath);
}

function getInjectableDatasource(pageName: string, domainDirectoryPath: string): string {
	const pascalCasePageName = changeCase.pascalCase(pageName);
	const snakeCasePageName = changeCase.snakeCase(pageName).toLowerCase();
	const pathCasePageName = changeCase.paramCase(pageName).toLowerCase();
	return `import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCasePageName}.dart';
import 'package:retrofit/retrofit.dart';

part '${snakeCasePageName}_api.datasource.g.dart';

@RestApi()
@injectable
abstract class ${pascalCasePageName}ApiDatasource {
  @factoryMethod
  factory ${pascalCasePageName}ApiDatasource(Dio dio, {@factoryParam String? baseUrl}) = _${pascalCasePageName}ApiDatasource;

  @GET('${pathCasePageName}')
  Future<${pascalCasePageName}> get();
}
`;
}

function getDatasource(pageName: string, domainDirectoryPath: string): string {
	const pascalCasePageName = changeCase.pascalCase(pageName);
	const snakeCasePageName = changeCase.snakeCase(pageName).toLowerCase();
	const pathCasePageName = changeCase.paramCase(pageName).toLowerCase();
	return `import 'package:dio/dio.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCasePageName}.dart';
import 'package:retrofit/retrofit.dart';

part '${snakeCasePageName}_api.datasource.g.dart';

@RestApi()
abstract class ${pascalCasePageName}ApiDatasource {
  factory ${pascalCasePageName}ApiDatasource(Dio dio, {String? baseUrl}) = _${pascalCasePageName}ApiDatasource;

  @GET('${pathCasePageName}')
  Future<${pascalCasePageName}> get();
}
`;
}