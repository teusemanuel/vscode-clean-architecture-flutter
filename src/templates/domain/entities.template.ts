import * as changeCase from "change-case";

export function getEntityTemplate (pageName: string): string {
    const pascalCasePageName = changeCase.pascalCase(pageName);
    const snakeCasePageName = changeCase.snakeCase(pageName).toLowerCase();
    return `import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part '${snakeCasePageName}.g.dart';

@JsonSerializable()
class ${pascalCasePageName} extends Equatable {
  final int id;

  const ${pascalCasePageName}({
    required this.id,
  });

  @override
  List<Object?> get props => [id];

  factory ${pascalCasePageName}.fromJson(Map<String, dynamic> json) => _$${pascalCasePageName}FromJson(json);
  Map<String, dynamic> toJson() => _$${pascalCasePageName}ToJson(this);
}
`;
}