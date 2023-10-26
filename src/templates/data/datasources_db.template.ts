import * as changeCase from "change-case";
import { workspace } from "vscode";
import { DatasourceTypeDB } from "../../utils/get-datasource-type";

export function getDatasourceDBTemplate(pageName: string, domainDirectoryPath: string, dbType: DatasourceTypeDB): string {
  const useInjectable = workspace.getConfiguration("architecture").get<boolean>("useInjectable");
  switch (dbType) {
    case DatasourceTypeDB.Sqflite:
      return getSqfliteDatasource(pageName, domainDirectoryPath, useInjectable);
    case DatasourceTypeDB.Floor:
      return getFloorDatasource(pageName, domainDirectoryPath);
    case DatasourceTypeDB.Hive:
      return getHiveDatasource(pageName, domainDirectoryPath, useInjectable);
    case DatasourceTypeDB.Objectbox:
      return getObjectboxDatasource(pageName, domainDirectoryPath, useInjectable);
    case DatasourceTypeDB.None:
    default:
      return getDefaultDatasource(pageName, domainDirectoryPath, useInjectable);
  }
}

function getSqfliteDatasource(
  dsName: string,
  domainDirectoryPath: string,
  useInjectable: boolean | undefined,
): string {
  const pascalCaseDatasourceName = changeCase.pascalCase(dsName);
  const camelCaseDatasourceName = changeCase.camelCase(dsName);
  const snakeCaseDatasourceName = changeCase.snakeCase(dsName).toLowerCase();
  return `${useInjectable ? "import 'package:injectable/injectable.dart';" : ""}
import 'package:sqflite/sqflite.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCaseDatasourceName}.dart';

${useInjectable ? "@injectable" : ""}
class ${pascalCaseDatasourceName}DBDatasource {
	// TODO Change table name
  static const String _table = "${snakeCaseDatasourceName}";
  final Database _db;
  ${pascalCaseDatasourceName}DBDatasource(this._db);

  Future<List<${pascalCaseDatasourceName}>>? get all async {
    final result = await _db.query(_table);
    return result.map((item) => ${pascalCaseDatasourceName}.fromJson(item)).toList();
  }

  Future<${pascalCaseDatasourceName}?> byId(int id) async {
    final result = await _db.query(_table, where: "id = ?", whereArgs: [id]);
    return result.isEmpty ? null : ${pascalCaseDatasourceName}.fromJson(result.first);
  }

  Future<${pascalCaseDatasourceName}?> save(${pascalCaseDatasourceName} ${camelCaseDatasourceName}) async {
    final id = await _db.insert(_table, ${camelCaseDatasourceName}.toJson(), conflictAlgorithm: ConflictAlgorithm.replace);
    return id > 0 ? ${camelCaseDatasourceName}.copyWith(id: id) : null;
  }

  Future<bool> update(int id, ${pascalCaseDatasourceName}? ${camelCaseDatasourceName}) async {
    final result = await _db.update(_table, ${camelCaseDatasourceName}?.toJson() ?? {}, where: "id = ?", whereArgs: [id]);
    return result > 0;
  }

  Future<bool> has${pascalCaseDatasourceName}(int id) async {
    final result = await _db.query(_table, where: "id = ?", whereArgs: [id]);
    return result.isNotEmpty;
  }

  Future<bool> remove(int id) async {
    final count = await _db.delete(_table, where: "id = ?", whereArgs: [id]);
    return count > 0;
  }
}
`;
}

function getFloorDatasource(
  dsName: string,
  domainDirectoryPath: string,
): string {
  const pascalCaseDatasourceName = changeCase.pascalCase(dsName);
  const camelCaseDatasourceName = changeCase.camelCase(dsName);
  const snakeCaseDatasourceName = changeCase.snakeCase(dsName).toLowerCase();
  return `import 'package:floor/floor.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCaseDatasourceName}.dart';

@dao
abstract class ${pascalCaseDatasourceName}DBDatasource {
  // TODO Change table name
  static const String _table = "${snakeCaseDatasourceName}";

  @Query('SELECT * FROM $_table')
  Future<List<${pascalCaseDatasourceName}>> get all;

  @Query('SELECT * FROM $_table WHERE id = :id')
  Future<${pascalCaseDatasourceName}?> byId(int id);

  @insert
  Future<void> save(${pascalCaseDatasourceName} ${camelCaseDatasourceName});

  @update
  Future<void> update(${pascalCaseDatasourceName}? ${camelCaseDatasourceName});

  @Query('SELECT 1 FROM $_table WHERE id = :id')
  Future<int?> has${pascalCaseDatasourceName}(int id);

  @delete
  Future<void> remove(${pascalCaseDatasourceName} ${camelCaseDatasourceName});
}
`;
}

function getHiveDatasource(
  dsName: string,
  domainDirectoryPath: string,
  useInjectable: boolean | undefined,
): string {
  const pascalCaseDatasourceName = changeCase.pascalCase(dsName);
  const camelCaseDatasourceName = changeCase.camelCase(dsName);
  const snakeCaseDatasourceName = changeCase.snakeCase(dsName).toLowerCase();
  return `${useInjectable ? "import 'package:injectable/injectable.dart';" : ""}
import 'package:hive/hive.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCaseDatasourceName}.dart';

${useInjectable ? "@injectable" : ""}
class ${pascalCaseDatasourceName}DBDatasource {
  final Box<${pascalCaseDatasourceName}> _${camelCaseDatasourceName}Box;
  ${pascalCaseDatasourceName}DBDatasource(): _${camelCaseDatasourceName}Box = Hive.box('${camelCaseDatasourceName}');

  List<${pascalCaseDatasourceName}>? get all => _${camelCaseDatasourceName}Box.toMap().values.toList();

  ${pascalCaseDatasourceName}? byId(int id) => _${camelCaseDatasourceName}Box.get(id);

  Future<void> save(dynamic key, ${pascalCaseDatasourceName} value) => _${camelCaseDatasourceName}Box.put(key, value);

  Future<void> update(int index, ${pascalCaseDatasourceName}? value) {
    if (value != null) {
      return _${camelCaseDatasourceName}Box.putAt(index, value);
    } else {
      return Future.value();
    }
  }

  bool has${pascalCaseDatasourceName}(dynamic key) => _${camelCaseDatasourceName}Box.containsKey(key);

  Future<void> remove(dynamic key) => _${camelCaseDatasourceName}Box.delete(key);
}
`;
}

function getObjectboxDatasource(
  dsName: string,
  domainDirectoryPath: string,
  useInjectable: boolean | undefined,
): string {
  const pascalCaseDatasourceName = changeCase.pascalCase(dsName);
  const camelCaseDatasourceName = changeCase.camelCase(dsName);
  const snakeCaseDatasourceName = changeCase.snakeCase(dsName).toLowerCase();
  return `${useInjectable ? "import 'package:injectable/injectable.dart';" : ""}
import 'package:objectbox/objectbox.dart';
import 'package:${domainDirectoryPath}/entities/${snakeCaseDatasourceName}.dart';

${useInjectable ? "@injectable" : ""}
class ${pascalCaseDatasourceName}DBDatasource {
  final Box<${pascalCaseDatasourceName}> _${camelCaseDatasourceName}Box;
  ${pascalCaseDatasourceName}DBDatasource(Store store): _${camelCaseDatasourceName}Box = Box<${pascalCaseDatasourceName}>(_store);

  List<${pascalCaseDatasourceName}>? get all => _${camelCaseDatasourceName}Box.getAll();

  ${pascalCaseDatasourceName}? byId(int id) => _${camelCaseDatasourceName}Box.get(id);

  Future<${pascalCaseDatasourceName}> save(${pascalCaseDatasourceName} value) => _${camelCaseDatasourceName}Box.putAndGetAsync(value);

  int? update(${pascalCaseDatasourceName}? value) {
    if (value != null) {
      return _${camelCaseDatasourceName}Box.put(value);
    } else {
      return null;
    }
  }

  bool has${pascalCaseDatasourceName}(int id) => _${camelCaseDatasourceName}Box.contains(id);

  Future<bool> remove(int id) => _${camelCaseDatasourceName}Box.removeAsync(id);
}
`;
}

function getDefaultDatasource(
  dsName: string,
  domainDirectoryPath: string,
  useInjectable: boolean | undefined,
): string {
  const pascalCaseDatasourceName = changeCase.pascalCase(dsName);
  const camelCaseDatasourceName = changeCase.camelCase(dsName);
  const snakeCaseDatasourceName = changeCase.snakeCase(dsName).toLowerCase();

  return `${useInjectable ? "import 'package:injectable/injectable.dart';" : ""}
import 'package:${domainDirectoryPath}/entities/${snakeCaseDatasourceName}.dart';

${useInjectable ? "@injectable" : ""}
class ${pascalCaseDatasourceName}DBDatasource {
  // TODO Change table name
  static const String _${camelCaseDatasourceName} = "${snakeCaseDatasourceName}";
  ${pascalCaseDatasourceName}DBDatasource();

  ${pascalCaseDatasourceName}? get ${camelCaseDatasourceName} => throw UnimplementedError();;

  set ${camelCaseDatasourceName}(${pascalCaseDatasourceName}? value) => throw UnimplementedError();;

  bool get has${pascalCaseDatasourceName} => throw UnimplementedError();;

  Future<bool> remove(int id) => throw UnimplementedError();;
}
`;
}