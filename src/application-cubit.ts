import * as _ from "lodash";
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { existsSync, lstatSync, writeFile, appendFile } from "fs";
import { Generator } from "./core/generator";
import {
    getCubitStateTemplate,
    getCubitTemplate,
} from "./templates";
import { createDirectories, createDirectory } from "./utils/directory";
import { getPageTemplate } from "./templates/application/pages.template";

export class ApplicationCubit extends Generator {
    async generate(featureName: string, targetDirectory: string, packageName: string): Promise<any> {
        const featureNamePath = changeCase.snakeCase(featureName).toLowerCase()
        // Create the application layer
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
            "cubit",
            "pages",
            "widgets",
        ]);


        const packagePath = path.join(packageName, "application", featureNamePath);
        // Generate the bloc code in the application layer
        await this.generateCubitCode(featureName, featureDirectoryPath, true, packagePath);
    }

    generateCubitCode = async (blocName: string, targetDirectory: string, useEquatable: boolean, packagePath: string): Promise<void> => {
        const blocDirectoryPath = `${targetDirectory}/cubit`;
        if (!existsSync(blocDirectoryPath)) {
            await createDirectory(blocDirectoryPath);
        }
        const pageDirectoryPath = `${targetDirectory}/pages`;
        if (!existsSync(pageDirectoryPath)) {
            await createDirectory(pageDirectoryPath);
        }

        await Promise.all([
            this.createByTemplate(blocName, 'state', targetDirectory, useEquatable, packagePath),
            this.createByTemplate(blocName, 'cubit', targetDirectory, useEquatable, packagePath),
            this.createByTemplate(blocName, 'page', targetDirectory, useEquatable, packagePath),
        ]);
    }

    private createByTemplate = (
        fileName: string,
        type: 'state' | 'cubit' | 'page',
        featureDirectoryPath: string,
        useEquatable: boolean,
        packagePath: string
    ) => {
        const snakeCaseFileName = changeCase.snakeCase(fileName).toLowerCase();
        let path: string = '';
        let data: string = '';
        switch (type) {
            case "state":
                path = `${featureDirectoryPath}/cubit/${snakeCaseFileName}_state.dart`;
                data = getCubitStateTemplate(fileName, useEquatable);
                break;
            case "cubit":
                path = `${featureDirectoryPath}/cubit/${snakeCaseFileName}_cubit.dart`;
                data = getCubitTemplate(fileName, useEquatable);
                break;
            case "page":
                path = `${featureDirectoryPath}/pages/${snakeCaseFileName}.page.dart`;
                data = getPageTemplate(fileName, packagePath, 'cubit');
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