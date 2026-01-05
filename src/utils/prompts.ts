import { lstatSync } from "fs";
import * as _ from "lodash";
import { Uri, OpenDialogOptions, window, InputBoxOptions, QuickPickOptions } from "vscode";
import { DatasourceType } from "./get-datasource-type";
import { BlocTemplateType } from "./get-bloc-type";


export async function getTargetDirectory(uri: Uri): Promise<string> {
	let targetDirectory;
	if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
		targetDirectory = await promptForTargetDirectory();
		if (_.isNil(targetDirectory)) {
			throw Error("Please select a valid directory");
		}
	} else {
		targetDirectory = uri.fsPath;
	}

	return targetDirectory;
}

export async function promptForTargetDirectory(openLabel = 'Select a folder to create the feature in'): Promise<string | undefined> {
	const options: OpenDialogOptions = {
		canSelectMany: false,
		openLabel: openLabel,
		canSelectFolders: true,
	};

	return window.showOpenDialog(options).then((uri) => {
		if (_.isNil(uri) || _.isEmpty(uri)) {
			return undefined;
		}
		return uri[0].fsPath;
	});
}

export function promptForName(title?: string, placeHolder?: string): Thenable<string | undefined> {
	const blocNamePromptOptions: InputBoxOptions = {
		prompt: title,
		placeHolder: placeHolder,
	};
	return window.showInputBox(blocNamePromptOptions);
}


export async function promptForDatasourceType(): Promise<DatasourceType> {
	const useInjectablePromptValues: string[] = ["api (default)", "db", "local"];
	const useInjectablePromptOptions: QuickPickOptions = {
		placeHolder:
			"What Datasource type you whant to use?",
		canPickMany: false,
	};

	const answer = await window.showQuickPick(
		useInjectablePromptValues,
		useInjectablePromptOptions
	);

	switch (answer) {
		case 'db':
			return DatasourceType.DB;
		case 'local':
			return DatasourceType.SPref;
		default:
			return DatasourceType.API;
	}
}

export async function promptToSelectBlocTemplateType(): Promise<BlocTemplateType | null> {
	const useStateManagementPromptValues: string[] = ["bloc (advanced)", "cubit"];
	const useStateMamagementPromptOptions: QuickPickOptions = {
		placeHolder:
			"Do you want to use bloc or cubit for State management?",
		canPickMany: false,
	};

	const answer = await window.showQuickPick(
		useStateManagementPromptValues,
		useStateMamagementPromptOptions
	);

	if (answer === "bloc (advanced)") {
		return BlocTemplateType.Bloc;
	}
	else if (answer === "cubit") {
		return BlocTemplateType.Cubit;
	} else {
		return null;
	}
}