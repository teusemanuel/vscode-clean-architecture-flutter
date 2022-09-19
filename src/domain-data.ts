import * as _ from "lodash";
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";
import * as path from "path";
import {
    getRepositoryTemplate,
    getEntityTemplate,
    getRepositoryInterfaceTemplate,
} from "./templates";
import { existsSync, writeFile } from "fs";
import { Generator } from "./core/generator";
import { createDirectories, createDirectory } from "./utils/directory";

export class DomainData extends Generator {
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
        const featureDataDirectoryPath = path.join(dataDirectoryPath, featureNamePath);

        await createDirectories(featureDataDirectoryPath, [
            "datasources",
            "models",
            "repositories",
        ]);

        // Create the domain layer
        const domainDirectoryPath = path.join(targetDirectory, "domain");

        if (!existsSync(dataDirectoryPath)) {
            await createDirectory(dataDirectoryPath);
        }

        // Create the feature inside domain layer
        const featureDomainDirectoryPath = path.join(domainDirectoryPath, featureNamePath);

        await createDirectories(featureDomainDirectoryPath, [
            "entities",
            "repositories",
        ]);


        const packageDomainPath = path.join(packageName, "domain", featureNamePath);
        const packageDataPath = path.join(packageName, "data", featureNamePath);

        // Generate the models and repositories code in the data layer
        await Promise.all([
            this.createByTemplate(featureName, 'data.repositories', featureDataDirectoryPath, packageDomainPath, packageDataPath, useInjectable),
        ]);

        // Generate the entities and repositories code in the domain layer
        await Promise.all([
            this.createByTemplate(featureName, 'domain.entities', featureDomainDirectoryPath, packageDomainPath, packageDataPath),
            this.createByTemplate(featureName, 'domain.repositories', featureDomainDirectoryPath, packageDomainPath, packageDataPath),
        ]);
    }

    private createByTemplate = (
        fileName: string,
        type:  'data.repositories' | 'domain.entities' | 'domain.repositories',
        directoryPath: string,
        packageDomainPath: string,
        packageDataPath: string,
        useInjectable?: boolean,
    ) => {
        const snakeCaseFileName = changeCase.snakeCase(fileName).toLowerCase();
        let path: string = '';
        let data: string = '';
        switch (type) {
            case "data.repositories":
                path = `${directoryPath}/repositories/${snakeCaseFileName}.repository.dart`;
                data = getRepositoryTemplate(fileName, packageDomainPath, packageDataPath, useInjectable == true);
                break;
            case "domain.entities":
                path = `${directoryPath}/entities/${snakeCaseFileName}.dart`;
                data = getEntityTemplate(fileName);
                break;
            case "domain.repositories":
                path = `${directoryPath}/repositories/${snakeCaseFileName}.repository.i.dart`;
                data = getRepositoryInterfaceTemplate(fileName, packageDomainPath);
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