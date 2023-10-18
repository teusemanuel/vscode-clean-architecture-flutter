import * as _ from "lodash";

import {
	commands,
	ExtensionContext
} from "vscode";
import { newApplicationDomainData, newBlocApplication, newCubitApplication, newDatasource, newDomainData } from "./commands";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(_context: ExtensionContext) {
	_context.subscriptions.push(
		commands.registerCommand("extension.architecture-bloc-application", newBlocApplication),
		commands.registerCommand("extension.architecture-cubit-application", newCubitApplication),
		commands.registerCommand("extension.architecture-domain-data", newDomainData),
		commands.registerCommand("extension.architecture-datasource", newDatasource),
		commands.registerCommand("extension.architecture-all", newApplicationDomainData),
	);
}

// this method is called when your extension is deactivated
// export function deactivate() { }