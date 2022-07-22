import * as changeCase from "change-case";

export function getBlocTemplate (blocName: string, useInjectable: boolean): string {
  return useInjectable
    ? getInjectableBlocTemplate(blocName)
    : getDefaultBlocTemplate(blocName);
}

function getInjectableBlocTemplate (blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const camelCaseBlocName = changeCase.camelCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName).toLowerCase();
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import 'package:flutter/material.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';

@injectable
class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  // Inject repository
  // final I${pascalCaseBlocName}Repository _${camelCaseBlocName}Repository;
  ${pascalCaseBlocName}Bloc(/* I${pascalCaseBlocName}Repository ${camelCaseBlocName}Repository */) 
      : /* _${camelCaseBlocName}Repository = ${camelCaseBlocName}Repository, */ 
        super(${pascalCaseBlocName}Initial()) {
    on<${pascalCaseBlocName}Event>((event, emit) {
      // TODO: implement event handler
    });
  }
}
`;
}

function getDefaultBlocTemplate (blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName).toLowerCase();
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';

class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  ${pascalCaseBlocName}Bloc() : super(${pascalCaseBlocName}Initial()) {
    on<${pascalCaseBlocName}Event>((event, emit) {
      // TODO: implement event handler
    });
  }

  factory ${pascalCaseBlocName}Bloc.of(BuildContext context) {
    // TODO: inject repositories
    return ${pascalCaseBlocName}Bloc();
  }
}
`;
}