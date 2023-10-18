import * as _ from "lodash";

export function isNameValid(featureName: string | undefined): boolean {
	// Check if feature name is null or white space
	if (_.isNil(featureName) || featureName.trim() === "") {
		return false;
	}
	// Return true if feature name is valid
	return true;
}