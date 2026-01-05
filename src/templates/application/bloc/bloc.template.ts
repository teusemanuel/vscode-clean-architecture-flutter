import * as changeCase from "change-case";
import { BlocType } from "../../../utils";
import { workspace } from "vscode";

export function getBlocTemplate(blocName: string, type: BlocType): string {
  const useInjectable = workspace.getConfiguration("architecture").get<boolean>("useInjectable");

  switch (type) {
    case BlocType.Freezed:
      return useInjectable ? getFreezedInjectableBlocTemplate(blocName) : getFreezedBlocTemplate(blocName);
    case BlocType.Equatable:
      return useInjectable ? getEquatableInjectableBlocTemplate(blocName) : getEquatableBlocTemplate(blocName);
    default:
      return useInjectable ? getDefaultInjectableBlocTemplate(blocName) : getDefaultBlocTemplate(blocName);
  }
}

function getEquatableInjectableBlocTemplate(blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const camelCaseBlocName = changeCase.camelCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName).toLowerCase();
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';

@injectable
class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  // Inject repository
  // final I${pascalCaseBlocName}Repository ${camelCaseBlocName}Repository;
  ${pascalCaseBlocName}Bloc(/* this.${camelCaseBlocName}Repository */) : super(${pascalCaseBlocName}Initial()) {
    on<${pascalCaseBlocName}Event>((event, emit) {
      // TODO: implement event handler
    });
  }
}
`;
}

function getEquatableBlocTemplate(blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';

class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  ${pascalCaseBlocName}Bloc() : super(${pascalCaseBlocName}Initial()) {
    on<${blocEvent}>((event, emit) {
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

function getDefaultInjectableBlocTemplate(blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName).toLowerCase();
  const camelCaseBlocName = changeCase.camelCase(blocName);
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:injectable/injectable.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';
@injectable
class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  // Inject repository
  // final I${pascalCaseBlocName}Repository ${camelCaseBlocName}Repository;
  ${pascalCaseBlocName}Bloc(/* this.${camelCaseBlocName}Repository */) : super(${pascalCaseBlocName}Initial()) {
    on<${pascalCaseBlocName}Event>((event, emit) {
      // TODO: implement event handler
    });
  }
}
`;
}

function getDefaultBlocTemplate(blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName).toLowerCase();
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:equatable/equatable.dart';

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

export function getFreezedInjectableBlocTemplate(blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const camelCaseBlocName = changeCase.camelCase(blocName);
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';
part '${snakeCaseBlocName}_bloc.freezed.dart';

@injectable
class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  // Inject repository
  // final I${pascalCaseBlocName}Repository ${camelCaseBlocName}Repository;
  ${pascalCaseBlocName}Bloc(/* this.${camelCaseBlocName}Repository */) : super(_Initial()) {
    on<${blocEvent}>((event, emit) {
      // TODO: implement event handler
    });
  }
}
`;
}

export function getFreezedBlocTemplate(blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';
part '${snakeCaseBlocName}_bloc.freezed.dart';

class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  ${pascalCaseBlocName}Bloc() : super(_Initial()) {
    on<${blocEvent}>((event, emit) {
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