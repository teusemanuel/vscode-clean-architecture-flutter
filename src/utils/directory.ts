import { existsSync } from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";

export async function createDirectories(
  targetDirectory: string,
  childDirectories: string[]
): Promise<void> {
  // Create the parent directory
  if (!existsSync(targetDirectory)) {
    await createDirectory(targetDirectory);
  }
  // Creat the children
  childDirectories.map(
    async (directory) =>
      await createDirectory(path.join(targetDirectory, directory))
  );
}

export async function createDirectory(targetDirectory: string): Promise<void> {
  await mkdirp(targetDirectory);
}