import { hasDependency } from "./has-dependency";

const equatable = "equatable";
const freezed_annotation = "freezed_annotation";

export const enum BlocTemplateType {
  Bloc = 'Bloc',
  Cubit = 'Cubit',
}

export const enum BlocType {
  Simple = 'Simple',
  Equatable = 'Equatable',
  Freezed = 'Freezed',
}

export async function getDefaultDependency(): Promise<BlocType> {
  if (await hasDependency(freezed_annotation)) {
    return BlocType.Freezed;
  } else if (await hasDependency(equatable)) {
    return BlocType.Equatable;
  } else {
    return BlocType.Simple;
  }
}
