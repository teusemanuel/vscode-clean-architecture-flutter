import * as _ from "lodash";

import {
	commands,
	ExtensionContext,
	Uri
} from "vscode";
import { newApplicationDomainData, newBlocApplication, newCubitApplication, newDatasource, newDomainData } from "./commands";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(_context: ExtensionContext) {
	_context.subscriptions.push(
		commands.registerCommand("extension.architecture-bloc-application", (uri: Uri) => newBlocApplication(uri)),
		commands.registerCommand("extension.architecture-cubit-application", (uri: Uri) => newCubitApplication(uri)),
		commands.registerCommand("extension.architecture-domain-data", (uri: Uri) => newDomainData(uri)),
		commands.registerCommand("extension.architecture-datasource", (uri: Uri) => newDatasource(uri)),
		commands.registerCommand("extension.architecture-all", (uri: Uri) => newApplicationDomainData(uri)),
	);
}

// this method is called when your extension is deactivated
// export function deactivate() { }