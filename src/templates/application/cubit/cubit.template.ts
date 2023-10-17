import * as changeCase from "change-case";
import { BlocType } from "../../../utils";
import { workspace } from "vscode";

export function getCubitTemplate(cubitName: string, type: BlocType): string {
  const useInjectable = workspace.getConfiguration("architecture").get<boolean>("useInjectable");
  switch (type) {
    case BlocType.Freezed:
      return useInjectable ? getFreezedInjectableCubitTemplate(cubitName) : getFreezedCubitTemplate(cubitName);
    case BlocType.Equatable:
      return useInjectable ? getEquatableInjectableCubitTemplate(cubitName) : getEquatableCubitTemplate(cubitName);
    default:
      return useInjectable ? getDefaultInjectableCubitTemplate(cubitName) : getDefaultCubitTemplate(cubitName);
  }
}

function getEquatableInjectableCubitTemplate(cubitName: string) {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName);
  const snakeCaseCubitName = changeCase.snakeCase(cubitName);
  const camelCaseCubitName = changeCase.camelCase(cubitName);
  const cubitState = `${pascalCaseCubitName}State`;
  return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

part '${snakeCaseCubitName}_state.dart';

@injectable
class ${pascalCaseCubitName}Cubit extends Cubit<${cubitState}> {
  // Inject repository
  // final I${pascalCaseCubitName}Repository ${camelCaseCubitName}Repository;
  ${pascalCaseCubitName}Cubit(/* this.${camelCaseCubitName}Repository */) : super(${pascalCaseCubitName}Initial());
}
`;
}

function getEquatableCubitTemplate(cubitName: string) {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName);
  const snakeCaseCubitName = changeCase.snakeCase(cubitName);
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

function getDefaultInjectableCubitTemplate(cubitName: string) {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName);
  const snakeCaseCubitName = changeCase.snakeCase(cubitName);
  const camelCaseCubitName = changeCase.camelCase(cubitName);
  const cubitState = `${pascalCaseCubitName}State`;
  return `import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:injectable/injectable.dart';

part '${snakeCaseCubitName}_state.dart';

@injectable
class ${pascalCaseCubitName}Cubit extends Cubit<${cubitState}> {
  // Inject repository
  // final I${pascalCaseCubitName}Repository ${camelCaseCubitName}Repository;
  ${pascalCaseCubitName}Cubit(/* this.${camelCaseCubitName}Repository */) : super(${pascalCaseCubitName}Initial());
}
`;
}

function getDefaultCubitTemplate(cubitName: string) {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName);
  const snakeCaseCubitName = changeCase.snakeCase(cubitName);
  const cubitState = `${pascalCaseCubitName}State`;
  return `import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
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

export function getFreezedInjectableCubitTemplate(cubitName: string) {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName);
  const snakeCaseCubitName = changeCase.snakeCase(cubitName);
  const camelCaseCubitName = changeCase.camelCase(cubitName);
  const cubitState = `${pascalCaseCubitName}State`;
  return `import 'package:bloc/bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part '${snakeCaseCubitName}_state.dart';
part '${snakeCaseCubitName}_cubit.freezed.dart';

@injectable
class ${pascalCaseCubitName}Cubit extends Cubit<${cubitState}> {
  // Inject repository
  // final I${pascalCaseCubitName}Repository ${camelCaseCubitName}Repository;
  ${pascalCaseCubitName}Cubit(/* this.${camelCaseCubitName}Repository */) : super(${pascalCaseCubitName}State.initial());
}
`;
}

export function getFreezedCubitTemplate(cubitName: string) {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName);
  const snakeCaseCubitName = changeCase.snakeCase(cubitName);
  const cubitState = `${pascalCaseCubitName}State`;
  return `import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/material.dart';

part '${snakeCaseCubitName}_state.dart';
part '${snakeCaseCubitName}_cubit.freezed.dart';

class ${pascalCaseCubitName}Cubit extends Cubit<${cubitState}> {
  ${pascalCaseCubitName}Cubit() : super(${pascalCaseCubitName}State.initial());

  factory ${pascalCaseCubitName}Cubit.of(BuildContext context) {
    // TODO: inject repositories
    return ${pascalCaseCubitName}Cubit();
  }
}
`;
}