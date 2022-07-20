import * as changeCase from "change-case";

export function getRepositoryTemplate (pageName: string, domainDirectoryPath: string, dataDirectoryPath: string): string {
  const pascalCasePageName = changeCase.pascalCase(pageName);
  const snakeCasePageName = changeCase.snakeCase(pageName).toLowerCase();
  return `import 'package:${dataDirectoryPath}/models/${snakeCasePageName}.model.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCasePageName}.dart';
import 'package:${domainDirectoryPath}/repositories/${snakeCasePageName}.repository.i.dart';

class ${pascalCasePageName}Repository implements I${pascalCasePageName}Repository {
    
  @override
  Future<bool> update${pascalCasePageName}(${pascalCasePageName} value) async {
    // TODO: implement update${pascalCasePageName}
    throw UnimplementedError();
  }

  @override
  Future<List<${pascalCasePageName}>> get() async {
    // TODO: implement get
    throw UnimplementedError();
  }

  @override
  Future<${pascalCasePageName}> byId(int id) async {
    // TODO: implement get${pascalCasePageName}
    throw UnimplementedError();
  }
}
`;
}