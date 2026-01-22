import * as changeCase from "change-case";
import { DomainType } from "../../utils/get-domain-type";

export function getEntityTemplate(entityName: string, type: DomainType): string {

  switch (type) {
    case DomainType.Freezed:
      return getFreezedEntityTemplate(entityName);
    case DomainType.Equatable:
      return getEquatableEntityTemplate(entityName);
    case DomainType.Simple:
    default:
      return getDefaultEntityTemplate(entityName);
  }
}

function getDefaultEntityTemplate(entityName: string) {
  const pascalCaseEntityName = changeCase.pascalCase(entityName);
  const snakeCaseEntityName = changeCase.snakeCase(entityName);
  return `import 'package:json_annotation/json_annotation.dart';

part '${snakeCaseEntityName}.g.dart';

@JsonSerializable()
abstract class ${pascalCaseEntityName} {
  final int id;
  //TODO Add all atributes

  const ${pascalCaseEntityName}({
    required this.id,
  });

  factory ${pascalCaseEntityName}.fromJson(Map<String, dynamic> json) => _$${pascalCaseEntityName}FromJson(json);
  Map<String, dynamic> toJson() => _$${pascalCaseEntityName}ToJson(this);
}
`;
}

function getEquatableEntityTemplate(entityName: string) {
  const pascalCaseEntityName = changeCase.pascalCase(entityName);
  const snakeCaseEntityName = changeCase.snakeCase(entityName);
  return `import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part '${snakeCaseEntityName}.g.dart';

@JsonSerializable()
class ${pascalCaseEntityName} extends Equatable {
  final int id;
  //TODO Add all atributes

  const ${pascalCaseEntityName}({
    required this.id,
  });

  @override
  List<Object?> get props => [id];

  factory ${pascalCaseEntityName}.fromJson(Map<String, dynamic> json) => _$${pascalCaseEntityName}FromJson(json);
  Map<String, dynamic> toJson() => _$${pascalCaseEntityName}ToJson(this);
}
`;
}

function getFreezedEntityTemplate(entityName: string) {
  const pascalCaseEntityName = changeCase.pascalCase(entityName);
  const snakeCaseEntityName = changeCase.snakeCase(entityName);
  return `import 'package:freezed_annotation/freezed_annotation.dart';

part '${snakeCaseEntityName}.freezed.dart';
part '${snakeCaseEntityName}.g.dart';

@freezed
class ${pascalCaseEntityName} with _$${pascalCaseEntityName} {
  const ${pascalCaseEntityName}._();
  
  @JsonSerializable()
  const factory ${pascalCaseEntityName}({
    @JsonKey(includeIfNull: false) required final int id,
    //TODO Add all atributes
  }) = _${pascalCaseEntityName};

  factory ${pascalCaseEntityName}.fromJson(Map<String, dynamic> json) => _$${pascalCaseEntityName}FromJson(json);
}
`;
}