import * as changeCase from "change-case";

export function getEntityTemplate (pageName: string): string {
    const pascalCasePageName = changeCase.pascalCase(pageName);
    return `import 'package:equatable/equatable.dart';

class ${pascalCasePageName} extends Equatable {
    final int id;

    const ${pascalCasePageName}({
        required this.id,
    });

    @override
    List<Object?> get props => [id];
}
`;
}