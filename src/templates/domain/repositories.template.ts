import * as changeCase from "change-case";

export function getDomainRepositoryTemplate(pageName: string, domainDirectoryPath: string): string {
  const pascalCasePageName = changeCase.pascalCase(pageName);
  const snakeCasePageName = changeCase.snakeCase(pageName).toLowerCase();
  return `import 'package:${domainDirectoryPath}/entities/${snakeCasePageName}.dart';

abstract class I${pascalCasePageName}Repository {
  Future<bool> update${pascalCasePageName}(${pascalCasePageName} value);
  Future<List<${pascalCasePageName}>> get();
  Future<${pascalCasePageName}> byId(int id);
}
`;
}