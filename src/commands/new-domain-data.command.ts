import {
	Uri,
	window,
} from "vscode";
import { promptForName, promptForTargetDirectory, isNameValid, createDirectory, getPackageName } from "../utils";
import * as _ from "lodash";
import * as changeCase from "change-case";
import { existsSync, lstatSync, writeFile } from "fs";
import * as path from "path";
import { getDataRepositoryTemplate, getDomainRepositoryTemplate, getEntityTemplate } from "../templates";
import { getDefaultDomainDependency } from "../utils/get-domain-type";

/**
 * External Function responsible to create Domain and Data folder in clean architecture
 * @param uri with path of the folder selected by user
 * @param domainDataName used when this function is called by `new-application-domain-data.command`
 * @returns  Promisse void
 */
export const newDomainData = async (uri: Uri, domainDataName?: string) => {
	domainDataName = domainDataName || await promptForName('Domain/Data Name', 'ex: user');
	if (!isNameValid(domainDataName)) {
		window.showErrorMessage("The domain/data name must not be empty");
		return;
	}

	/**
	 * Select path to create the domain and data
	 */
	let targetDir;
	if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
		targetDir = await promptForTargetDirectory('Select a folder to create the domain + data in');
		if (_.isNil(targetDir)) {
			window.showErrorMessage("Please select a valid directory");
			return;
		}
	} else {
		targetDir = uri.fsPath;
	}

	/**
	 * Validate If selected folder is child of `lib/` folder
	 */
	if (!targetDir.endsWith('lib') && !targetDir.endsWith('lib/')) {
		window.showErrorMessage("Domain and data are only allowed in the root of the lib/ folder");
		return;
	}

	/**
	 * Create data directory and folder name
	 */
	let dataDir = targetDir;
	for (const folder of ['data', changeCase.snakeCase(domainDataName!)]) {
		dataDir = `${dataDir}/${folder}`;
		if (!existsSync(path.normalize(dataDir))) {
			await createDirectory(path.normalize(dataDir));
		}
	}
	/**
	 * Create domain directory and folder name
	 */
	let domainDir = targetDir;
	for (const folder of ['domain', changeCase.snakeCase(domainDataName!)]) {
		domainDir = `${domainDir}/${folder}`;
		if (!existsSync(path.normalize(domainDir))) {
			await createDirectory(path.normalize(domainDir));
		}
	}

	const pascalCaseDomainDataName = changeCase.pascalCase(domainDataName!);

	try {
		await generateDomainDataCode(domainDataName!, dataDir, domainDir);
		window.showInformationMessage(
			`Successfully Generated ${pascalCaseDomainDataName} Data and Domain`
		);
	} catch (error) {
		window.showErrorMessage(
			`Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
		);
	}
};


async function generateDomainDataCode(
	ddName: string,
	dataDir: string,
	domainDir: string,
) {

	for (const folder of ['datasources', 'models', 'repositories']) {
		if (!existsSync(path.join(dataDir, folder))) {
			await createDirectory(path.join(dataDir, folder));
		}
	}

	for (const folder of ['entities', 'repositories']) {
		if (!existsSync(path.join(domainDir, folder))) {
			await createDirectory(path.join(domainDir, folder));
		}
	}

	await Promise.all([
		createDomainRepositoryTemplate(ddName, `${domainDir}/repositories`),
		createDomainEntityTemplate(ddName, `${domainDir}/entities`),
		createDataRepositoryTemplate(ddName, `${dataDir}/repositories`),
	]);
}

async function createDomainRepositoryTemplate(
	domainName: string,
	targetDirectory: string,
): Promise<void> {
	const snakeCaseBlocName = changeCase.snakeCase(domainName);
	const domainDir = `${await getPackageName()}/domain/${snakeCaseBlocName}`;
	const targetPath = path.join(targetDirectory, `${snakeCaseBlocName}.repository.i.dart`);
	if (existsSync(targetPath)) {
		throw Error(`${snakeCaseBlocName}.repository.i.dart already exists`);
	}
	return new Promise<void>((resolve, reject) => {
		writeFile(targetPath, getDomainRepositoryTemplate(domainName, domainDir), "utf8", (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

async function createDomainEntityTemplate(
	entityName: string,
	targetDirectory: string,
): Promise<void> {
	const snakeCaseBlocName = changeCase.snakeCase(entityName);
	const domainType = await getDefaultDomainDependency();
	const targetPath = path.join(targetDirectory, `${snakeCaseBlocName}.dart`);
	if (existsSync(targetPath)) {
		throw Error(`${snakeCaseBlocName}.dart already exists`);
	}
	return new Promise<void>((resolve, reject) => {
		writeFile(targetPath, getEntityTemplate(entityName, domainType), "utf8", (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

async function createDataRepositoryTemplate(
	dataName: string,
	targetDirectory: string,
): Promise<void> {
	const snakeCaseBlocName = changeCase.snakeCase(dataName);
	const domainDir = `${await getPackageName()}/domain/${snakeCaseBlocName}`;
	const targetPath = path.join(targetDirectory, `${snakeCaseBlocName}.repository.dart`);
	if (existsSync(targetPath)) {
		throw Error(`${snakeCaseBlocName}.repository.dart already exists`);
	}
	return new Promise<void>((resolve, reject) => {
		writeFile(targetPath, getDataRepositoryTemplate(dataName, domainDir), "utf8", (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}