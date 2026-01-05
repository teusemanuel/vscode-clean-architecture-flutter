import {
	Uri,
	window,
} from "vscode";
import * as changeCase from "change-case";
import * as path from "path";
import { promptForName, promptForTargetDirectory, isNameValid, getDefaultDependency, createDirectory, BlocType, BlocTemplateType } from "../utils";
import * as _ from "lodash";
import { existsSync, lstatSync, writeFile } from "fs";
import { getBlocEventTemplate, getBlocStateTemplate, getBlocTemplate } from "../templates";
import { getPageTemplate } from "../templates/application/pages.template";


/**
 * External Function responsible to create Bloc application in clean architecture (bloc/, page/, widgets/)
 * @param uri with path of the folder selected by user
 * @param blocName used when this function is called by `new-application-domain-data.command`
 * @returns  Promisse void
 */
export const newBlocApplication = async (uri: Uri, blocName?: string) => {
	blocName = blocName || await promptForName('Application Bloc Name', 'ex: home');
	if (!isNameValid(blocName)) {
		window.showErrorMessage("The application bloc name must not be empty");
		return;
	}

	/**
	 * Select path to create the application bloc
	 */
	let targetDir: string | undefined;
	if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
		targetDir = await promptForTargetDirectory('Select a folder to create the application bloc in');
		if (_.isNil(targetDir)) {
			window.showErrorMessage("Please select a valid directory");
			return;
		}
	} else {
		targetDir = uri.fsPath;
	}

	/**
	 * Validate and create if nescessario subfolder lib/application
	 */
	let applicationDir: string | undefined;
	if (targetDir.includes(path.join('lib', 'application'))) {
		applicationDir = targetDir;
	} else {
		applicationDir = path.join(targetDir, "application");
		if (!existsSync(applicationDir!)) {
			await createDirectory(applicationDir);
		}
	}

	/**
	 * Add Aplication page folder name
	 */
	const snakeCaseBlocName = changeCase.snakeCase(blocName!);
	applicationDir = path.join(applicationDir, snakeCaseBlocName);
	if (!existsSync(applicationDir!)) {
		await createDirectory(applicationDir);
	}

	const blocType = await getDefaultDependency();
	const pascalCaseBlocName = changeCase.pascalCase(blocName!);

	try {
		await generateApplicationBlocCode(blocName!, applicationDir, blocType);
		window.showInformationMessage(
			`Successfully Generated ${pascalCaseBlocName} Bloc`
		);
	} catch (error) {
		window.showErrorMessage(
			`Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
		);
	}
};

async function generateApplicationBlocCode(
	blocName: string,
	applicationDir: string,
	type: BlocType,
) {

	for (const folder of ['bloc', 'page', 'widgets']) {
		if (!existsSync(path.join(applicationDir, folder))) {
			await createDirectory(path.join(applicationDir, folder));
		}
	}

	await Promise.all([
		createBlocEventTemplate(blocName, path.join(applicationDir, 'bloc'), type),
		createBlocStateTemplate(blocName, path.join(applicationDir, 'bloc'), type),
		createBlocTemplate(blocName, path.join(applicationDir, 'bloc'), type),
		createPageTemplate(blocName, path.join(applicationDir, 'page')),
	]);
}

async function createBlocEventTemplate(
	blocName: string,
	targetDirectory: string,
	type: BlocType,
): Promise<void> {
	const snakeCaseBlocName = changeCase.snakeCase(blocName);
	const targetPath = path.join(targetDirectory, `${snakeCaseBlocName}_event.dart`);
	if (existsSync(targetPath)) {
		throw Error(`${snakeCaseBlocName}_event.dart already exists`);
	}
	return new Promise<void>((resolve, reject) => {
		writeFile(
			targetPath,
			getBlocEventTemplate(blocName, type),
			"utf8",
			(error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			}
		);
	});
}

async function createBlocStateTemplate(
	blocName: string,
	targetDirectory: string,
	type: BlocType,
): Promise<void> {
	const snakeCaseBlocName = changeCase.snakeCase(blocName);
	const targetPath = path.join(targetDirectory, `${snakeCaseBlocName}_state.dart`);
	if (existsSync(targetPath)) {
		throw Error(`${snakeCaseBlocName}_state.dart already exists`);
	}
	return new Promise<void>((resolve, reject) => {
		writeFile(
			targetPath,
			getBlocStateTemplate(blocName, type),
			"utf8",
			(error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			}
		);
	});
}

async function createBlocTemplate(
	blocName: string,
	targetDirectory: string,
	type: BlocType
): Promise<void> {
	const snakeCaseBlocName = changeCase.snakeCase(blocName);
	const targetPath = path.join(targetDirectory, `${snakeCaseBlocName}_bloc.dart`);
	if (existsSync(targetPath)) {
		throw Error(`${snakeCaseBlocName}_bloc.dart already exists`);
	}
	return new Promise<void>((resolve, reject) => {
		writeFile(targetPath, getBlocTemplate(blocName, type), "utf8", (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

async function createPageTemplate(
	pageName: string,
	targetDirectory: string
): Promise<void> {
	const snakeCasePageName = changeCase.snakeCase(pageName);
	const targetPath = path.join(targetDirectory, `${snakeCasePageName}.page.dart`);
	if (existsSync(targetPath)) {
		throw Error(`${snakeCasePageName}.page.dart already exists`);
	}
	const template = await getPageTemplate(pageName, targetDirectory, BlocTemplateType.Bloc);
	return new Promise<void>((resolve, reject) => {
		writeFile(targetPath, template, "utf8", (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}