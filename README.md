# Claen Code Bloc Architecture Scaffolding for Flutter

> **Based on [felangel](https://github.com/felangel) BLoC extension**

## Overview

This VS Code extension helps you quickly scaffold new features for Flutter apps using the BLoC architecture and clean code principles. It generates well-structured directories and boilerplate code for Application, Domain, and Data layers.

## Features

- Scaffold new BLoC or Cubit applications with a single command
- Generate domain data, datasources, and repositories
- Supports injectable and non-injectable templates
- Customizable directory and file structure
- Context menu integration for fast feature creation

## Installation

1. Open VS Code and go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
2. Search for `Bloc Architecture Scaffolding`
3. Click **Install**

Or install from the [VS Code Marketplace](https://marketplace.visualstudio.com/VSCode).

## Usage

### Command Palette

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type `Bloc Architecture: New Application` and select it

### Context Menu

1. Right-click on the folder where you want to create a new feature
2. Select one of the following:
   - **Bloc: New Application**
   - **Cubit: New Application**
   - **New Domain + data**
   - **New Datasource**
   - **New Application + Domain + data**

## Available Commands

- `extension.architecture-bloc-application`: Bloc: New Application
- `extension.architecture-cubit-application`: Cubit: New Application
- `extension.architecture-domain-data`: New Domain + data
- `extension.architecture-datasource`: New Datasource
- `extension.architecture-all`: New Application + Domain + data

## Configuration

You can customize the extension via VS Code settings:

- `architecture.useInjectable` (boolean): Use injectable annotations in templates (default: true)
- `architecture.injectionFile.path` (string): Path to the injection file inside the lib folder (default: core/injection/injection.dart)
- `architecture.localdb.type` (string): Type of local database injection (auto, sqflite, floor, hive, objectbox)

## Example Directory Structure

```
lib/
	application/
		page/
			{file}.page.dart
		bloc/
			{file}_bloc.dart
			{file}_event.dart
			{file}_state.dart
		cubit/
			{file}_cubit.dart
			{file}_state.dart
	core/
	data/
		{name}/
			datasources/
				{name}_api.datasource.dart
				{name}_db.datasource.dart
				{name}_local.datasource.dart
			models/
				{name}.dart
			repositories/
				{name}.repository.dart
	domain/
		{name}/
			entities/
				{name}.dart
			repositories/
				{name}.repository.i.dart
```

## Support & Feedback

For issues, feature requests, or questions, please open an issue on the [Github repository](https://github.com/teusemanuel/vscode-clean-architecture-flutter/issues) or contact the publisher.

## License

This extension is licensed under the MIT License. See [LICENSE.md](LICENSE.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes.
