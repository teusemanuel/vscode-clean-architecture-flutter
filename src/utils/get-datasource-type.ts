import { workspace } from "vscode";
import { hasDependency } from "./has-dependency";

const sqflite = "sqflite";
const floor = "floor";
const hive = "hive";
const objectbox = "objectbox";

/**
 * Tipe of datasource (api, dabase, shared preference).
 */
export const enum DatasourceType {
  /**
   * used for http(s) requests with remote server
   */
  API = 'API',
  /**
   * user to connnect on local database (sqlite, etc...)
   */
  DB = 'DB',
  /**
   * uset to get values from shared preferrence using ```{ 'key': 'value' }```
   */
  SPref = 'SPref',
}

export const enum DatasourceTypeDB {
  Sqflite = 'Sqflite',
  Floor = 'Floor',
  Hive = 'Hive',
  Objectbox = 'Objectbox',
  None = 'None',
}

export const enum TemplateSettingDB {
  Sqflite = 'Sqflite',
  Floor = 'Floor',
  Hive = 'Hive',
  Objectbox = 'Objectbox',
  Auto = 'Auto',
}

export async function getDatasourceDBType(): Promise<DatasourceTypeDB> {
  const setting = getTemplateSetting();
  switch (setting) {
    case TemplateSettingDB.Sqflite:
      return DatasourceTypeDB.Sqflite;
    case TemplateSettingDB.Floor:
      return DatasourceTypeDB.Floor;
    case TemplateSettingDB.Hive:
      return DatasourceTypeDB.Hive;
    case TemplateSettingDB.Objectbox:
      return DatasourceTypeDB.Objectbox;
    case TemplateSettingDB.Auto:
    default:
      return getDefaultDependency();
  }
}

async function getDefaultDependency(): Promise<DatasourceTypeDB> {
  if (await hasDependency(sqflite)) {
    return DatasourceTypeDB.Sqflite;
  } else if (await hasDependency(floor)) {
    return DatasourceTypeDB.Floor;
  } else if (await hasDependency(hive)) {
    return DatasourceTypeDB.Hive;
  } else if (await hasDependency(objectbox)) {
    return DatasourceTypeDB.Objectbox;
  } else {
    return DatasourceTypeDB.None;
  }
}



function getTemplateSetting(): TemplateSettingDB {
  let config: string | undefined = workspace.getConfiguration("architecture").get("localdb.type");

  switch (config) {
    case "sqflite":
      return TemplateSettingDB.Sqflite;
    case "floor":
      return TemplateSettingDB.Floor;
    case "hive":
      return TemplateSettingDB.Hive;
    case "objectbox":
      return TemplateSettingDB.Objectbox;
    default:
      return TemplateSettingDB.Auto;
  }
}
