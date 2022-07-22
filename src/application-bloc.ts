import * as _ from "lodash";
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";
import * as path from "path";
import {
    getBlocEventTemplate,
    getBlocStateTemplate,
    getBlocTemplate,
} from "./templates";
import { existsSync, lstatSync, writeFile, appendFile } from "fs";
import { Generator } from "./core/generator";
import { createDirectories, createDirectory } from "./utils/directory";
import { getPageTemplate } from "./templates/application/pages.template";

export class ApplicationBloc extends Generator {

    async generate(featureName: string, targetDirectory: string, packageName: string, useInjectable: boolean): Promise<any> {
        // Create the application layer
        const featureNamePath = changeCase.snakeCase(featureName).toLowerCase();
        const applicationDirectoryPath = path.join(
            targetDirectory,
            "application"
        );
        if (!existsSync(applicationDirectoryPath)) {
            await createDirectory(applicationDirectoryPath);
        }

        // Create the feature inside application layer
        const featureDirectoryPath = path.join(applicationDirectoryPath, featureNamePath);

        await createDirectories(featureDirectoryPath, [
            "bloc",
            "pages",
            "widgets",
        ]);

        const packagePath = path.join(packageName, "application", featureNamePath);
        // Generate the bloc code in the application layer
        await this.generateBlocCode(featureName, featureDirectoryPath, packagePath, useInjectable, packageName);
    }

    generateBlocCode = async (blocName: string, targetDirectory: string, packagePath: string, useInjectable: boolean, packageRoot: string): Promise<void> => {
        const blocDirectoryPath = `${targetDirectory}/bloc`;
        if (!existsSync(blocDirectoryPath)) {
            await createDirectory(blocDirectoryPath);
        }
        const pageDirectoryPath = `${targetDirectory}/pages`;
        if (!existsSync(pageDirectoryPath)) {
            await createDirectory(pageDirectoryPath);
        }

        await Promise.all([
            this.createByTemplate(blocName, 'event', targetDirectory, packagePath, useInjectable, packageRoot),
            this.createByTemplate(blocName, 'state', targetDirectory, packagePath, useInjectable, packageRoot),
            this.createByTemplate(blocName, 'bloc', targetDirectory, packagePath, useInjectable, packageRoot),
            this.createByTemplate(blocName, 'page', targetDirectory, packagePath, useInjectable, packageRoot),
        ]);
    }

    private createByTemplate = (
        fileName: string,
        type: 'event' | 'state' | 'bloc' | 'page',
        featureDirectoryPath: string,
        packagePath: string,
        useInjectable: boolean,
        packageRoot: string,
    ) => {
        const snakeCaseFileName = changeCase.snakeCase(fileName).toLowerCase();
        let path: string = '';
        let data: string = '';
        switch (type) {
            case "event":
                path = `${featureDirectoryPath}/bloc/${snakeCaseFileName}_event.dart`;
                data = getBlocEventTemplate(fileName, true);
                break;
            case "state":
                path = `${featureDirectoryPath}/bloc/${snakeCaseFileName}_state.dart`;
                data = getBlocStateTemplate(fileName, true);
                break;
            case "bloc":
                path = `${featureDirectoryPath}/bloc/${snakeCaseFileName}_bloc.dart`;
                data = getBlocTemplate(fileName, useInjectable);
                break;
            case "page":
                path = `${featureDirectoryPath}/pages/${snakeCaseFileName}.page.dart`;
                data = getPageTemplate(fileName, packagePath, 'bloc', packageRoot, useInjectable);
                break;

            default:
                break;
        }
        if (!path || !data) {
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