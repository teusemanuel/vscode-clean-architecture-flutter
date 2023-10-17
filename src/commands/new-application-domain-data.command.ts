import {
	Uri,
	window,
} from "vscode";
import { promptForName, promptForTargetDirectory, isNameValid } from "../utils";
import * as _ from "lodash";
import { lstatSync } from "fs";


export const newApplicationDomainData = async (uri: Uri) => {
	const applicationName = await promptForName('Feature Name', 'ex: home');
	if (!isNameValid(applicationName)) {
		window.showErrorMessage("The feature name must not be empty");
		return;
	}

	let targetDirectory;
	if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
		targetDirectory = await promptForTargetDirectory();
		if (_.isNil(targetDirectory)) {
			window.showErrorMessage("Please select a valid directory");
			return;
		}
	} else {
		targetDirectory = uri.fsPath;
	}
};