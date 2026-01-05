import { hasDependency } from "./has-dependency";

const equatable = "equatable";
const freezed_annotation = "freezed_annotation";

export const enum DomainType {
  Simple = 'Simple',
  Equatable = 'Equatable',
  Freezed = 'Freezed',
}

export async function getDefaultDomainDependency(): Promise<DomainType> {
  if (await hasDependency(freezed_annotation)) {
    return DomainType.Freezed;
  } else if (await hasDependency(equatable)) {
    return DomainType.Equatable;
  } else {
    return DomainType.Simple;
  }
}
