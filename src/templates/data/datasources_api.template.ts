import * as changeCase from "change-case";

export function getDatasourceAPITemplate(pageName: string, domainDirectoryPath: string, useInjectable: boolean, dioInjectionName: string): string {
	return useInjectable
		? getInjectableDatasource(pageName, domainDirectoryPath, dioInjectionName)
		: getDatasource(pageName, domainDirectoryPath);
}

function getInjectableDatasource(pageName: string, domainDirectoryPath: string, dioInjectionName: string): string {
	const pascalCasePageName = changeCase.pascalCase(pageName);
	const snakeCasePageName = changeCase.snakeCase(pageName).toLowerCase();
	const pathCasePageName = changeCase.paramCase(pageName).toLowerCase();
	return `import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:${domainDirectoryPath}/models/${snakeCasePageName}.model.dart';
import 'package:retrofit/retrofit.dart';

part '${snakeCasePageName}_api.datasource.g.dart';

@RestApi()
@injectable
abstract class ${pascalCasePageName}ApiDatasource {
  @factoryMethod
  factory ${pascalCasePageName}ApiDatasource(@Named('${dioInjectionName}') Dio dio, {@factoryParam String? baseUrl}) = _${pascalCasePageName}ApiDatasource;

  @GET('${pathCasePageName}')
  Future<${pascalCasePageName}Model> get();
}
`;
}

function getDatasource(pageName: string, domainDirectoryPath: string): string {
	const pascalCasePageName = changeCase.pascalCase(pageName);
	const snakeCasePageName = changeCase.snakeCase(pageName).toLowerCase();
	const pathCasePageName = changeCase.paramCase(pageName).toLowerCase();
	return `import 'package:dio/dio.dart';
import 'package:${domainDirectoryPath}/models/${snakeCasePageName}.model.dart';
import 'package:retrofit/retrofit.dart';

part '${snakeCasePageName}_api.datasource.g.dart';

@RestApi()
abstract class ${pascalCasePageName}ApiDatasource {
  factory ${pascalCasePageName}ApiDatasource(Dio dio, {String? baseUrl}) = _${pascalCasePageName}ApiDatasource;

  @GET('${pathCasePageName}')
  Future<${pascalCasePageName}Model> get();
}
`;
}