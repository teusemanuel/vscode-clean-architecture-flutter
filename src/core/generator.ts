export abstract class Generator {
    abstract generate(
        featureName: string,
        targetDirectory: string,
        packageName: string
    ): Promise<any>;
}