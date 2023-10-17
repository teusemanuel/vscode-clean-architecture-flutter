import {
	Uri,
	window,
} from "vscode";
import { promptForName, promptForTargetDirectory, isNameValid } from "../utils";
import * as _ from "lodash";
import { lstatSync } from "fs";


export const newDomainData = async (uri: Uri) => {
	const domainDataName = await promptForName('Domain/Data Name', 'ex: user');
	if (!isNameValid(domainDataName)) {
		window.showErrorMessage("The domain/data name must not be empty");
		return;
	}

	let targetDirectory;
	if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
		targetDirectory = await promptForTargetDirectory('Select a folder to create the domain + data in');
		if (_.isNil(targetDirectory)) {
			window.showErrorMessage("Please select a valid directory");
			return;
		}
	} else {
		targetDirectory = uri.fsPath;
	}
};