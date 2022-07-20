import * as _ from "lodash";

import { getPubspec } from ".";

export async function getPackageName () {
  const pubspec = await getPubspec();
  return _.get(pubspec, "name", '');
}