import * as _ from "lodash";

import { getPubspec } from ".";

export async function hasDevDependency(dependency: string) {
  const pubspec = await getPubspec();
  const dependencies = _.get(pubspec, "dev_dependencies", {});
  return _.has(dependencies, dependency);
}
