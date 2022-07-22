import * as changeCase from "change-case";

export function getCubitTemplate (cubitName: string, useInjectable: boolean): string {
  return useInjectable
    ? getInjectableCubitTemplate(cubitName)
    : getDefaultCubitTemplate(cubitName);
}

function getInjectableCubitTemplate (cubitName: string) {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName);
  const camelCaseCubiName = changeCase.camelCase(cubitName);
  const snakeCaseCubitName = changeCase.snakeCase(cubitName).toLowerCase();
  const cubitState = `${pascalCaseCubitName}State`;
  return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import 'package:flutter/material.dart';

part '${snakeCaseCubitName}_state.dart';

@injectable
class ${pascalCaseCubitName}Cubit extends Cubit<${cubitState}> {
  // Inject repository
  // final I${pascalCaseCubitName}Repository _${camelCaseCubiName}Repository;
  ${pascalCaseCubitName}Cubit(/* I${pascalCaseCubitName}Repository ${camelCaseCubiName}Repository */)
    : /* _${camelCaseCubiName}Repository = ${camelCaseCubiName}Repository, */ 
      super(${pascalCaseCubitName}Initial());
}
`;
}

function getDefaultCubitTemplate (cubitName: string) {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName);
  const snakeCaseCubitName = changeCase.snakeCase(cubitName).toLowerCase();
  const cubitState = `${pascalCaseCubitName}State`;
  return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

part '${snakeCaseCubitName}_state.dart';

class ${pascalCaseCubitName}Cubit extends Cubit<${cubitState}> {
  ${pascalCaseCubitName}Cubit() : super(${pascalCaseCubitName}Initial());

  factory ${pascalCaseCubitName}Cubit.of(BuildContext context) {
    // TODO: inject repositories
    return ${pascalCaseCubitName}Cubit();
  }
}
`;
}