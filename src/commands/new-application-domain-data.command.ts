import {
	Uri,
	window,
} from "vscode";
import { promptForName, promptForTargetDirectory, isNameValid, promptToSelectBlocTemplateType, BlocTemplateType } from "../utils";
import * as _ from "lodash";
import { lstatSync } from "fs";
import * as path from "path";
import { newCubitApplication } from "./new-cubit-application.command";
import { newBlocApplication } from "./new-bloc-application.command";
import { newDatasource } from "./new-datasource.command";
import { newDomainData } from "./new-domain-data.command";


export const newApplicationDomainData = async (uri: Uri) => {
	const appName = await promptForName('Feature Name', 'ex: home');
	if (!isNameValid(appName)) {
		window.showErrorMessage("The feature name must not be empty");
		return;
	}

	let targetDir;
	if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
		targetDir = await promptForTargetDirectory();
		if (_.isNil(targetDir)) {
			window.showErrorMessage("Please select a valid directory");
			return;
		}
	} else {
		targetDir = uri.fsPath;
	}

	const blocType = await promptToSelectBlocTemplateType();
	if (_.isNil(blocType)) {
		window.showErrorMessage("Please select a valid bloc type");
		return;
	}

	switch (blocType) {
		case BlocTemplateType.Cubit:
			await newCubitApplication(uri, appName);
			break;
		default:
			await newBlocApplication(uri, appName);
			break;
	}

	const entityName = await promptForName('Entity Name', 'ex: user');
	if (!isNameValid(entityName)) {
		window.showErrorMessage("The entity name must not be empty");
		return;
	}
	const libNormalized = path.normalize("/lib");
	const baseLibUri = Uri.parse(targetDir.substring(0, targetDir.lastIndexOf(libNormalized) + libNormalized.length))

	await newDomainData(baseLibUri, entityName);
	await newDatasource(baseLibUri, entityName);

};