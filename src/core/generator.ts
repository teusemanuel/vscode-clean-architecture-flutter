export abstract class Generator {
    abstract generate(
        featureName: string,
        targetDirectory: string,
        packageName: string,
        useInjectable: boolean,
    ): Promise<any>;
}