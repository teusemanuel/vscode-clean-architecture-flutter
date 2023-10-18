import {
	Uri,
	window,
} from "vscode";
import { promptForName, promptForTargetDirectory, isNameValid, createDirectory, promptForDatasourceType, getPackageName } from "../utils";
import * as _ from "lodash";
import * as changeCase from "change-case";
import { existsSync, lstatSync, writeFile } from "fs";
import * as path from "path";
import { DatasourceType, getDatasourceDBType } from "../utils/get-datasource-type";
import { getDatasourceAPITemplate, getDatasourceDBTemplate, getDatasourceLocalTemplate } from "../templates";

/**
 * External Function responsible to create datasource in clean architecture (*_db.datasource.dart, *_api.datasource.dart, *_pref.datasource.dart)
 * @param uri with path of the folder selected by user
 * @returns  Promisse void
 */
export const newDatasource = async (uri: Uri) => {
	const dsName = await promptForName('Datasource Name', 'ex: user');
	if (!isNameValid(dsName)) {
		window.showErrorMessage("The datasource name must not be empty");
		return;
	}

	/**
	 * Select path to create the datasource
	 */
	let targetDir;
	if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
		targetDir = await promptForTargetDirectory('Select a folder to create the datasource in');
		if (_.isNil(targetDir)) {
			window.showErrorMessage("Please select a valid directory");
			return;
		}
	} else {
		targetDir = uri.fsPath;
	}

	/**
	 * Validate and create if nescessario subfolder lib/data
	 */
	let dsDir: string | undefined;
	if (targetDir.includes('lib/data')) {
		dsDir = targetDir;
	} else {
		dsDir = path.join(
			targetDir,
			"data"
		);
		if (!existsSync(dsDir!)) {
			await createDirectory(dsDir);
		}
	}

	/**
	 * Add Aplication page folder name
	 */
	const snakeCaseDSName = changeCase.snakeCase(dsName!);
	dsDir = path.join(dsDir, snakeCaseDSName);
	if (!existsSync(dsDir!)) {
		await createDirectory(dsDir);
	}

	const pascalCaseDatasourceName = changeCase.pascalCase(dsName!);

	try {
		await generateDatasourceCode(dsName!, dsDir);
		window.showInformationMessage(
			`Successfully Generated ${pascalCaseDatasourceName} Datasource`
		);
	} catch (error) {
		window.showErrorMessage(
			`Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
		);
	}
};

async function generateDatasourceCode(
	dsName: string,
	dsDir: string
) {

	const dsType = await promptForDatasourceType();
	if (!existsSync(`${dsDir}/datasources`)) {
		await createDirectory(`${dsDir}/datasources`);
	}
	switch (dsType) {
		case DatasourceType.DB:
			return await createDBDatasource(dsName, `${dsDir}/datasources`);
		case DatasourceType.SPref:
			return await createSPrefDatasource(dsName, `${dsDir}/datasources`);
		case DatasourceType.API:
		default:
			return await createAPIDatasource(dsName, `${dsDir}/datasources`);
	}
}

async function createDBDatasource(
	dsName: string,
	targetDirectory: string
) {
	const snakeCaseDsName = changeCase.snakeCase(dsName);
	const domainDir = path.join(await getPackageName(), "domain", snakeCaseDsName);
	const dbType = await getDatasourceDBType();
	const targetPath = `${targetDirectory}/${snakeCaseDsName}_db.datasource.dart`;
	if (existsSync(targetPath)) {
		throw Error(`${snakeCaseDsName}_db.datasource.dart already exists`);
	}
	return new Promise<void>(async (resolve, reject) => {
		writeFile(
			targetPath,
			getDatasourceDBTemplate(dsName, domainDir, dbType),
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

async function createAPIDatasource(
	dsName: string,
	targetDirectory: string
) {
	const snakeCaseDsName = changeCase.snakeCase(dsName);
	const domainDir = path.join(await getPackageName(), "domain", snakeCaseDsName);
	const targetPath = `${targetDirectory}/${snakeCaseDsName}_api.datasource.dart`;
	if (existsSync(targetPath)) {
		throw Error(`${snakeCaseDsName}_api.datasource.dart already exists`);
	}
	return new Promise<void>(async (resolve, reject) => {
		writeFile(
			targetPath,
			getDatasourceAPITemplate(dsName, domainDir),
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

async function createSPrefDatasource(
	dsName: string,
	targetDirectory: string
) {
	const snakeCaseDsName = changeCase.snakeCase(dsName);
	const domainDir = path.join(await getPackageName(), "domain", snakeCaseDsName);
	const targetPath = `${targetDirectory}/${snakeCaseDsName}_sp.datasource.dart`;
	if (existsSync(targetPath)) {
		throw Error(`${snakeCaseDsName}_sp.datasource.dart already exists`);
	}
	return new Promise<void>(async (resolve, reject) => {
		writeFile(
			targetPath,
			getDatasourceLocalTemplate(dsName, domainDir),
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