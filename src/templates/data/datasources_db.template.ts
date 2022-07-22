import * as changeCase from "change-case";

export function getDatasourceDBTemplate(pageName: string, domainDirectoryPath: string, useInjectable: boolean, dioInjectionName: string): string {
	throw Error('In Development, not ready yet.');
	/* return useInjectable
		? getInjectableDatasource(pageName, domainDirectoryPath, dioInjectionName)
		: getDatasource(pageName, domainDirectoryPath); */
}

function getInjectableDatasource(pageName: string, domainDirectoryPath: string, dioInjectionName: string): string {
	const pascalCaseDatasourceName = changeCase.pascalCase(pageName);
	const snakeCaseDatasourceName = changeCase.snakeCase(pageName).toLowerCase();
	const pathCaseDatasourceName = changeCase.paramCase(pageName).toLowerCase();
	return `import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:${domainDirectoryPath}/models/${snakeCaseDatasourceName}.model.dart';
import 'package:retrofit/retrofit.dart';

part '${snakeCaseDatasourceName}_api.datasource.g.dart';

@RestApi()
@injectable
abstract class ${pascalCaseDatasourceName}ApiDatasource {
  @factoryMethod
  factory ${pascalCaseDatasourceName}ApiDatasource(@Named('${dioInjectionName}') Dio dio, {@factoryParam String? baseUrl}) = _${pascalCaseDatasourceName}ApiDatasource;

  @GET('${pathCaseDatasourceName}')
  Future<${pascalCaseDatasourceName}Model> get();
}
`;
}

function getDatasource(pageName: string, domainDirectoryPath: string): string {
	const pascalCaseDatasourceName = changeCase.pascalCase(pageName);
	const snakeCaseDatasourceName = changeCase.snakeCase(pageName).toLowerCase();
	const pathCaseDatasourceName = changeCase.paramCase(pageName).toLowerCase();
	return `import 'package:dio/dio.dart';
import 'package:${domainDirectoryPath}/models/${snakeCaseDatasourceName}.model.dart';
import 'package:retrofit/retrofit.dart';

part '${snakeCaseDatasourceName}_api.datasource.g.dart';

@RestApi()
abstract class ${pascalCaseDatasourceName}ApiDatasource {
  factory ${pascalCaseDatasourceName}ApiDatasource(Dio dio, {String? baseUrl}) = _${pascalCaseDatasourceName}ApiDatasource;

  @GET('${pathCaseDatasourceName}')
  Future<${pascalCaseDatasourceName}Model> get();
}
`;
}