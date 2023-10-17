import * as changeCase from "change-case";
import { workspace } from "vscode";

export function getDatasourceLocalTemplate(pageName: string, domainDirectoryPath: string): string {
  const useInjectable = workspace.getConfiguration("architecture").get<boolean>("useInjectable");
  return useInjectable
    ? getInjectableDatasource(pageName, domainDirectoryPath)
    : getDatasource(pageName, domainDirectoryPath);
}

function getInjectableDatasource(pageName: string, domainDirectoryPath: string,): string {
  const pascalCaseDatasourceName = changeCase.pascalCase(pageName);
  const camelCaseDatasourceName = changeCase.camelCase(pageName);
  const snakeCaseDatasourceName = changeCase.snakeCase(pageName).toLowerCase();
  return `import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCaseDatasourceName}.dart';

part '${snakeCaseDatasourceName}_api.datasource.g.dart';

@singleton
class ${pascalCaseDatasourceName}LocalDatasource {
  // TODO Change key name
  static const String _${camelCaseDatasourceName} = "app_name_key_${camelCaseDatasourceName}";
  final SharedPreferences _prefs;
  ${pascalCaseDatasourceName}LocalDatasource(SharedPreferences prefs) : _prefs = prefs;

  ${pascalCaseDatasourceName}? get ${camelCaseDatasourceName} => hasSession ? ${pascalCaseDatasourceName}.fromJson(jsonDecode(_prefs.getString(_${camelCaseDatasourceName}) ?? '')) : null;

  set ${camelCaseDatasourceName}(${pascalCaseDatasourceName}? value) => value != null ? _prefs.setString(_${camelCaseDatasourceName}, jsonEncode(value.toJson())) : Future.value(false);

  bool get has${pascalCaseDatasourceName} => _prefs.containsKey(_${camelCaseDatasourceName});

  Future<bool> remove() => _prefs.remove(_${camelCaseDatasourceName});
}
`;
}

function getDatasource(pageName: string, domainDirectoryPath: string): string {
  const pascalCaseDatasourceName = changeCase.pascalCase(pageName);
  const camelCaseDatasourceName = changeCase.camelCase(pageName);
  const snakeCaseDatasourceName = changeCase.snakeCase(pageName).toLowerCase();
  return `import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCaseDatasourceName}.dart';

part '${snakeCaseDatasourceName}_api.datasource.g.dart';

@singleton
class ${pascalCaseDatasourceName}LocalDatasource {
  // TODO Change key name
  static const String _${camelCaseDatasourceName} = "app_name_key_${camelCaseDatasourceName}";
  final SharedPreferences _prefs;
  ${pascalCaseDatasourceName}LocalDatasource(SharedPreferences prefs) : _prefs = prefs;

  ${pascalCaseDatasourceName}? get ${camelCaseDatasourceName} => hasSession ? ${pascalCaseDatasourceName}.fromJson(jsonDecode(_prefs.getString(_${camelCaseDatasourceName}) ?? '')) : null;

  set ${camelCaseDatasourceName}(${pascalCaseDatasourceName}? value) => value != null ? _prefs.setString(_${camelCaseDatasourceName}, jsonEncode(value.toJson())) : Future.value(false);

  bool get has${pascalCaseDatasourceName} => _prefs.containsKey(_${camelCaseDatasourceName});

  Future<bool> remove() => _prefs.remove(_${camelCaseDatasourceName});
}
`;
}