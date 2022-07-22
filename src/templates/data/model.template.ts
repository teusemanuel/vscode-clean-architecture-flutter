import * as changeCase from "change-case";

export function getModelTemplate (pageName: string, domainDirectoryPath: string): string {
  const pascalCasePageName = changeCase.pascalCase(pageName);
  const snakeCasePageName = changeCase.snakeCase(pageName).toLowerCase();
  return `import 'package:${domainDirectoryPath}/entities/${snakeCasePageName}.dart';
import 'package:json_annotation/json_annotation.dart';

part '${snakeCasePageName}.model.g.dart';

@JsonSerializable()
class ${pascalCasePageName}Model extends ${pascalCasePageName} {
  const ${pascalCasePageName}Model({
    required super.id,
  });

  factory ${pascalCasePageName}Model.fromJson(Map<String, dynamic> json) =>
      _$${pascalCasePageName}ModelFromJson(json);
  Map<String, dynamic> toJson() => _$${pascalCasePageName}ModelToJson(this);
}
`;
}