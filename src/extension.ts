import * as _ from "lodash";
import * as changeCase from "change-case";

import {
	commands,
	ExtensionContext,
	InputBoxOptions,
	OpenDialogOptions,
	QuickPickOptions,
	Uri,
	window,
} from "vscode";
import { lstatSync } from "fs";
import { analyzeDependencies, getPackageName } from "./utils";
import { ApplicationBloc } from "./application-bloc";
import { Generator } from "./core/generator";
import { ApplicationCubit } from "./application-cubit";
import { DomainData } from "./domain-data";
import { Datasource } from "./datasource";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	analyzeDependencies();

	const blocCommand = commands.registerCommand("extension.bloc-architecture-application-bloc", async (uri: Uri) => {
		execute(uri, 'bloc');
	});

	const cubitCommand = commands.registerCommand("extension.bloc-architecture-application-cubit", async (uri: Uri) => {
		execute(uri, 'cubit');
	});

	const dataCommand = commands.registerCommand("extension.bloc-architecture-domain-data", async (uri: Uri) => {
		execute(uri, 'domain-data');
	});

	const datasourceCommand = commands.registerCommand("extension.bloc-architecture-datasource", async (uri: Uri) => {
		execute(uri, 'datasource');
	});

	const allCommand = commands.registerCommand("extension.bloc-architecture-all", async (uri: Uri) => {
		execute(uri, 'all');
	});

	context.subscriptions.push(blocCommand, cubitCommand, dataCommand, datasourceCommand, allCommand);
}

// this method is called when your extension is deactivated
export function deactivate() { }


export async function execute(uri: Uri, type: 'bloc' | 'cubit' | 'domain-data' | 'datasource' | 'all') {
	// Show feature prompt
	let featureName = await promptForFeatureName();

	// Abort if name is not valid
	if (!isNameValid(featureName)) {
		window.showErrorMessage("The name must not be empty");
		return;
	}
	featureName = `${featureName}`;

	let targetDirectory = "";
	try {
		targetDirectory = await getTargetDirectory(uri);
	} catch (error: any) {
		window.showErrorMessage(error.message);
	}

	const useInjectable: boolean = await promptForUseInjectable();

	const pascalCaseFeatureName = changeCase.pascalCase(featureName);

	try {
		let generators: Generator[] = [];
		let message = ''
		const packageName = await getPackageName();
		switch (type) {
			case "bloc":
				generators.push(new ApplicationBloc());
				message = `Successfully Generated ${pascalCaseFeatureName} Application Bloc`;
				break;
			case "cubit":
				generators.push(new ApplicationCubit());
				message = `Successfully Generated ${pascalCaseFeatureName} Application Cubit`;
				break;
			case "domain-data":
				generators.push(new DomainData());
				message = `Successfully Generated ${pascalCaseFeatureName} Domain + Data`;
				break;
			case "datasource":
				generators.push(new Datasource());
				message = `Successfully Generated ${pascalCaseFeatureName} Datasource`;
				break;
			case "all":
				const useBloc = await promptForUseCubitOrBloc();
				generators.push(useBloc ? new ApplicationBloc() : new ApplicationCubit());
				generators.push(new DomainData());
				message = `Successfully Generated ${pascalCaseFeatureName} Application + Domain + Data`;
				break;

			default:
				break;
		}
		for (const generator of generators) {
			await generator.generate(`${featureName}`, targetDirectory, packageName, useInjectable);
		}
		window.showInformationMessage(message);
	} catch (error) {
		window.showErrorMessage(
			`Error:
		  ${error instanceof Error ? error.message : JSON.stringify(error)}`
		);
	}
}

export function isNameValid(featureName: string | undefined): boolean {
	// Check if feature name exists
	if (!featureName) {
		return false;
	}
	// Check if feature name is null or white space
	if (_.isNil(featureName) || featureName.trim() === "") {
		return false;
	}

	// Return true if feature name is valid
	return true;
}

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

export async function promptForTargetDirectory(): Promise<string | undefined> {
	const options: OpenDialogOptions = {
		canSelectMany: false,
		openLabel: "Select a folder to create the feature in",
		canSelectFolders: true,
	};

	return window.showOpenDialog(options).then((uri) => {
		if (_.isNil(uri) || _.isEmpty(uri)) {
			return undefined;
		}
		return uri[0].fsPath;
	});
}

export function promptForFeatureName(): Thenable<string | undefined> {
	const blocNamePromptOptions: InputBoxOptions = {
		prompt: "Feature Name",
		placeHolder: "page",
	};
	return window.showInputBox(blocNamePromptOptions);
}

export async function promptForUseCubitOrBloc(): Promise<boolean> {
	const useStateManagementPromptValues: string[] = ["cubit (default)", "bloc (advanced)"];
	const useStateMamagementPromptOptions: QuickPickOptions = {
		placeHolder:
			"Do you want to use bloc or cubit for State management?",
		canPickMany: false,
	};

	const answer = await window.showQuickPick(
		useStateManagementPromptValues,
		useStateMamagementPromptOptions
	);

	return answer === "bloc (advanced)";
}

export async function promptForUseInjectable(): Promise<boolean> {
	const useInjectablePromptValues: string[] = ["yes (default)", "no"];
	const useInjectablePromptOptions: QuickPickOptions = {
		placeHolder:
			"Do you want to use injectable?",
		canPickMany: false,
	};

	const answer = await window.showQuickPick(
		useInjectablePromptValues,
		useInjectablePromptOptions
	);

	return answer !== "no";
}

