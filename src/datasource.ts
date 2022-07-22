import * as _ from "lodash";
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";
import * as path from "path";
import {
    getDatasourceAPITemplate,
    getDatasourceDBTemplate,
    getDatasourceLocalTemplate,
} from "./templates";
import { existsSync, writeFile } from "fs";
import { Generator } from "./core/generator";
import { createDirectories, createDirectory } from "./utils/directory";
import { InputBoxOptions, QuickPickOptions, window } from "vscode";

export class Datasource extends Generator {
    async generate(featureName: string, targetDirectory: string, packageName: string, useInjectable: boolean): Promise<any> {
        const featureNamePath = changeCase.snakeCase(featureName).toLowerCase();
        // Create the data layer
        const dataDirectoryPath = path.join(
            targetDirectory,
            "data"
        );
        if (!existsSync(dataDirectoryPath)) {
            await createDirectory(dataDirectoryPath);
        }

        // Create the feature inside data layer
        const featureDataSourceDirectoryPath = path.join(dataDirectoryPath, featureNamePath);

        await createDirectories(featureDataSourceDirectoryPath, [
            "datasources",
        ]);
        const packageDataPath = path.join(packageName, "data", featureNamePath);
        // Generate the datasources, models and repositories code in the data layer
        await this.createByTemplate(featureName, featureDataSourceDirectoryPath, packageDataPath, useInjectable);
    }
    private createByTemplate = async (
        fileName: string,
        directoryPath: string,
        packageDataPath: string,
        useInjectable: boolean,
    ) => {
        const snakeCaseFileName = changeCase.snakeCase(fileName).toLowerCase();

        let dioInjectionName = '';
        if(useInjectable) {
            dioInjectionName = (await promptForDioInjectionName()) || 'dioClient'
        }
        let dsType = await promptForDSType();

        let path ='';
        let data ='';

        switch (dsType) {
            case "db":
                path = `${directoryPath}/datasources/${snakeCaseFileName}_db.datasource.dart`;
                data = getDatasourceDBTemplate(fileName, packageDataPath, useInjectable, dioInjectionName);
                break;
            case "local":
                path = `${directoryPath}/datasources/${snakeCaseFileName}_local.datasource.dart`;
                data = getDatasourceLocalTemplate(fileName, packageDataPath, useInjectable, dioInjectionName);
                break;
        
            default:
                path = `${directoryPath}/datasources/${snakeCaseFileName}_api.datasource.dart`;
                data = getDatasourceAPITemplate(fileName, packageDataPath, useInjectable, dioInjectionName);
                break;
        }

        if (!data) {
            throw Error(`${snakeCaseFileName} don't have a valid template`);
        }

        if (existsSync(path)) {
            throw Error(`${path.split('/')[path.length - 1]} already exists`);
        }

        return new Promise(async (resolve, reject) => {
            writeFile(
                path,
                data,
                "utf8",
                (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(true);
                }
            );
        });
    }
}

function promptForDioInjectionName(): Thenable<string | undefined> {
	const blocNamePromptOptions: InputBoxOptions = {
		prompt: "Dio Injection Name",
		placeHolder: "default (clientDio)",
	};
	return window.showInputBox(blocNamePromptOptions);
}



async function promptForDSType(): Promise<'api' | 'db' | 'local'> {
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
            return 'db';
        case 'local':
            return 'local';
        default:
            return 'api';
    }
}