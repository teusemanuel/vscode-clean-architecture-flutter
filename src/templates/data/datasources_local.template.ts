import * as changeCase from "change-case";
import { workspace } from "vscode";

export function getDatasourceLocalTemplate(dsName: string, domainDirectoryPath: string): string {
  const useInjectable = workspace.getConfiguration("architecture").get<boolean>("useInjectable");
  return useInjectable
    ? getInjectableDatasource(dsName, domainDirectoryPath)
    : getDatasource(dsName, domainDirectoryPath);
}

function getInjectableDatasource(dsName: string, domainDirectoryPath: string,): string {
  const pascalCaseDatasourceName = changeCase.pascalCase(dsName);
  const camelCaseDatasourceName = changeCase.camelCase(dsName);
  const snakeCaseDatasourceName = changeCase.snakeCase(dsName).toLowerCase();
  return `import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCaseDatasourceName}.dart';

@singleton
class ${pascalCaseDatasourceName}SPDatasource {
  // TODO Change key name
  static const String _${camelCaseDatasourceName} = "app_name_key_${snakeCaseDatasourceName}";
  final SharedPreferences _prefs;
  ${pascalCaseDatasourceName}SPDatasource(this._prefs);

  ${pascalCaseDatasourceName}? get ${camelCaseDatasourceName} => hasSession ? ${pascalCaseDatasourceName}.fromJson(jsonDecode(_prefs.getString(_${camelCaseDatasourceName}) ?? '')) : null;

  set ${camelCaseDatasourceName}(${pascalCaseDatasourceName}? value) => value != null ? _prefs.setString(_${camelCaseDatasourceName}, jsonEncode(value.toJson())) : Future.value(false);

  bool get has${pascalCaseDatasourceName} => _prefs.containsKey(_${camelCaseDatasourceName});

  Future<bool> remove() => _prefs.remove(_${camelCaseDatasourceName});
}
`;
}

function getDatasource(dsName: string, domainDirectoryPath: string): string {
  const pascalCaseDatasourceName = changeCase.pascalCase(dsName);
  const camelCaseDatasourceName = changeCase.camelCase(dsName);
  const snakeCaseDatasourceName = changeCase.snakeCase(dsName).toLowerCase();
  return `import 'package:shared_preferences/shared_preferences.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCaseDatasourceName}.dart';

class ${pascalCaseDatasourceName}SPDatasource {
  // TODO Change key name
  static const String _${camelCaseDatasourceName} = "app_name_key_${snakeCaseDatasourceName}";
  final SharedPreferences _prefs;
  ${pascalCaseDatasourceName}SPDatasource(this._prefs);

  ${pascalCaseDatasourceName}? get ${camelCaseDatasourceName} => hasSession ? ${pascalCaseDatasourceName}.fromJson(jsonDecode(_prefs.getString(_${camelCaseDatasourceName}) ?? '')) : null;

  set ${camelCaseDatasourceName}(${pascalCaseDatasourceName}? value) => value != null ? _prefs.setString(_${camelCaseDatasourceName}, jsonEncode(value.toJson())) : Future.value(false);

  bool get has${pascalCaseDatasourceName} => _prefs.containsKey(_${camelCaseDatasourceName});

  Future<bool> remove() => _prefs.remove(_${camelCaseDatasourceName});
}
`;
}