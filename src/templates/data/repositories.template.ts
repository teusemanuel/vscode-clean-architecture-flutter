import * as changeCase from "change-case";

export function getRepositoryTemplate(pageName: string, domainDirectoryPath: string, dataDirectoryPath: string, useInjectable: boolean): string {
  return useInjectable
    ? getRepositoryInjectable(pageName, domainDirectoryPath, dataDirectoryPath)
    : getRepository(pageName, domainDirectoryPath, dataDirectoryPath);
}

function getRepositoryInjectable(pageName: string, domainDirectoryPath: string, dataDirectoryPath: string): string {
  const pascalCaseRepositoryName = changeCase.pascalCase(pageName);
  const camelCaseRepositoryName = changeCase.camelCase(pageName);
  const snakeCaseRepositoryName = changeCase.snakeCase(pageName).toLowerCase();
  return `import 'package:injectable/injectable.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCaseRepositoryName}.dart';
import 'package:${domainDirectoryPath}/repositories/${snakeCaseRepositoryName}.repository.i.dart';

@Injectable(as: I${pascalCaseRepositoryName}Repository)
class ${pascalCaseRepositoryName}Repository implements I${pascalCaseRepositoryName}Repository {
  // Inject datasource
  // final ${pascalCaseRepositoryName}ApiDatasource _${camelCaseRepositoryName}API;
  // ${pascalCaseRepositoryName}Repository(${pascalCaseRepositoryName}ApiDatasource ${camelCaseRepositoryName}API) : _${camelCaseRepositoryName}API = ${camelCaseRepositoryName}API;
    
  @override
  Future<bool> update${pascalCaseRepositoryName}(${pascalCaseRepositoryName} value) async {
    // TODO: implement update${pascalCaseRepositoryName}
    throw UnimplementedError();
  }

  @override
  Future<List<${pascalCaseRepositoryName}>> get() async {
    // TODO: implement get
    throw UnimplementedError();
  }

  @override
  Future<${pascalCaseRepositoryName}> byId(int id) async {
    // TODO: implement get${pascalCaseRepositoryName}
    throw UnimplementedError();
  }
}
`;
}

function getRepository(pageName: string, domainDirectoryPath: string, dataDirectoryPath: string): string {
  const pascalCaseRepositoryName = changeCase.pascalCase(pageName);
  const snakeCaseRepositoryName = changeCase.snakeCase(pageName).toLowerCase();
  return `import 'package:${domainDirectoryPath}/entities/${snakeCaseRepositoryName}.dart';
import 'package:${domainDirectoryPath}/repositories/${snakeCaseRepositoryName}.repository.i.dart';

class ${pascalCaseRepositoryName}Repository implements I${pascalCaseRepositoryName}Repository {
    
  @override
  Future<bool> update${pascalCaseRepositoryName}(${pascalCaseRepositoryName} value) async {
    // TODO: implement update${pascalCaseRepositoryName}
    throw UnimplementedError();
  }

  @override
  Future<List<${pascalCaseRepositoryName}>> get() async {
    // TODO: implement get
    throw UnimplementedError();
  }

  @override
  Future<${pascalCaseRepositoryName}> byId(int id) async {
    // TODO: implement get${pascalCaseRepositoryName}
    throw UnimplementedError();
  }
}
`;
}