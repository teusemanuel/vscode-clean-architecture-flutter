import {
	Uri,
	window,
} from "vscode";
import { promptForName, promptForTargetDirectory, isNameValid, createDirectory, getDefaultDependency, BlocType, BlocTemplateType } from "../utils";
import * as _ from "lodash";
import * as changeCase from "change-case";
import * as path from "path";
import { existsSync, lstatSync, writeFile } from "fs";
import { getCubitStateTemplate, getCubitTemplate } from "../templates";
import { getPageTemplate } from "../templates/application/pages.template";

/**
 * External Function responsible to create Cubit application in clean architecture (cubit/, page/, widgets/)
 * @param uri with path of the folder selected by user
 * @param cubitName used when this function is called by `new-application-domain-data.command`
 * @returns  Promisse void
 */
export const newCubitApplication = async (uri: Uri, cubitName?: string) => {
	cubitName = cubitName || await promptForName('Application Cubit Name', 'ex: home');
	if (!isNameValid(cubitName)) {
		window.showErrorMessage("The application cubit name must not be empty");
		return;
	}

	/**
	 * Select path to create the application cubit
	 */
	let targetDir: string | undefined;
	if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
		targetDir = await promptForTargetDirectory('Select a folder to create the application cubit in');
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
	const snakeCaseCubitName = changeCase.snakeCase(cubitName!);
	applicationDir = path.join(applicationDir, snakeCaseCubitName);
	if (!existsSync(applicationDir!)) {
		await createDirectory(applicationDir);
	}

	const blocType = await getDefaultDependency();
	const pascalCaseCubitName = changeCase.pascalCase(cubitName!);

	try {
		await generateApplicationCubitCode(cubitName!, applicationDir, blocType);
		window.showInformationMessage(
			`Successfully Generated ${pascalCaseCubitName} Cubit`
		);
	} catch (error) {
		window.showErrorMessage(
			`Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
		);
	}
};

async function generateApplicationCubitCode(
	cubitName: string,
	applicationDir: string,
	type: BlocType
) {

	for (const folder of ['cubit', 'page', 'widgets']) {
		if (!existsSync(path.join(applicationDir, folder))) {
			await createDirectory(path.join(applicationDir, folder));
		}
	}
	await Promise.all([
		createCubitStateTemplate(cubitName, path.join(applicationDir, 'cubit'), type),
		createCubitTemplate(cubitName, path.join(applicationDir, 'cubit'), type),
		createPageTemplate(cubitName, path.join(applicationDir, 'page')),
	]);
}

function createCubitStateTemplate(
	cubitName: string,
	targetDirectory: string,
	type: BlocType
) {
	const snakeCaseCubitName = changeCase.snakeCase(cubitName);
	const targetPath = path.join(targetDirectory, `${snakeCaseCubitName}_state.dart`);
	if (existsSync(targetPath)) {
		throw Error(`${snakeCaseCubitName}_state.dart already exists`);
	}
	return new Promise<void>((resolve, reject) => {
		writeFile(
			targetPath,
			getCubitStateTemplate(cubitName, type),
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

function createCubitTemplate(
	cubitName: string,
	targetDirectory: string,
	type: BlocType
) {
	const snakeCaseCubitName = changeCase.snakeCase(cubitName);
	const targetPath = path.join(targetDirectory, `${snakeCaseCubitName}_cubit.dart`);
	if (existsSync(targetPath)) {
		throw Error(`${snakeCaseCubitName}_cubit.dart already exists`);
	}
	return new Promise<void>((resolve, reject) => {
		writeFile(
			targetPath,
			getCubitTemplate(cubitName, type),
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

async function createPageTemplate(
	pageName: string,
	targetDirectory: string
): Promise<void> {
	const snakeCasePageName = changeCase.snakeCase(pageName);
	const targetPath = path.join(targetDirectory, `${snakeCasePageName}.page.dart`);
	if (existsSync(targetPath)) {
		throw Error(`${snakeCasePageName}.page.dart already exists`);
	}
	const template = await getPageTemplate(pageName, targetDirectory, BlocTemplateType.Cubit);
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