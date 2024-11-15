import path from 'path';
import { DMMF } from '@prisma/generator-helper';
import {
  ImportDeclarationStructure,
  SourceFile,
  StructureKind,
  VariableDeclarationKind,
} from 'ts-morph';
import { Config, PrismaOptions } from './config';
import { dotSlash, formatStyle, needsRelatedModel, useModelNames } from './util';
import { getZodConstructor } from './types';
import { logger } from '@prisma/sdk';

export const writeImportsForModel = (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config,
  { outputPath, clientPath }: PrismaOptions
): void => {
  const { relatedModelName } = useModelNames(config);
  /// NOTE: Import zod
  const importList: ImportDeclarationStructure[] = [
    {
      kind: StructureKind.ImportDeclaration,
      namespaceImport: 'z',
      moduleSpecifier: 'zod',
    },
  ];

  /// NOTE: Grab all enum fieldss
  const enumFields = model.fields.filter((f) => f.kind === 'enum');
  /// NOTE: Grab all fiels with relation
  const relationFields = model.fields.filter((f) => f.kind === 'object');
  const relativePath = path.relative(outputPath, clientPath);

  /// NOTE: If we have some enum
  if (enumFields.length > 0) {
    importList.push({
      kind: StructureKind.ImportDeclaration,
      isTypeOnly: false,
      moduleSpecifier: dotSlash(relativePath),
      namedImports: enumFields.map((f) => f.type),
    });
  }

  /// NOTE: If we have some relationed fields
  if (config.relationModel !== false && relationFields.length > 0) {
    /// NOTE: Filter out fields with the same name as the model
    const filteredFields = relationFields.filter((f) => f.type !== model.name);

    /// NOTE: If we have some other named fields (That means that we need to import them)
    if (filteredFields.length > 0) {
      /// NOTE: Import only the CompleteModel
      importList.push({
        kind: StructureKind.ImportDeclaration,
        moduleSpecifier: './index',
        namedImports: Array.from(
          new Set(filteredFields.flatMap((f) => [`Complete${f.type}`, relatedModelName(f.type)]))
        ),
      });
    }
  }

  sourceFile.addImportDeclarations(importList);
};

export const generateSchemaForModel = (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prismaOptions: PrismaOptions
): void => {
  const { modelName, createName } = useModelNames(config);

  /// NOTE: Generate Complete Schema
  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    leadingTrivia: (writer) => writer.blankLineIfLastNot(),
    declarations: [
      {
        name: modelName(model.name),
        initializer(writer) {
          writer
            .write('z.object(')
            .inlineBlock(() => {
              model.fields
                .filter((f) => f.kind !== 'object')
                .forEach((field) => {
                  writer
                    .write(`${field.name}: ${getZodConstructor(field)}`)
                    .write(',')
                    .newLine();
                });
            })
            .write(')');
        },
      },
    ],
  });

  /// NOTE: Generate Create Schema
  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    leadingTrivia: (write) => write.blankLineIfLastNot(),
    declarations: [
      {
        name: createName(model.name),
        initializer: (writer) => {
          let relationFieldsId: string[] = [];
          model.fields.forEach((f) => {
            if (f.relationFromFields && f.relationFromFields.length > 0) {
              relationFieldsId = relationFieldsId.concat(f.relationFromFields);
            }
          });
          logger.info(`${model.name}: founfd relation fields: `, relationFieldsId);
          writer
            .write('z.object(')
            .inlineBlock(() => {
              model.fields
                .filter((f) => f.kind !== 'object')
                .filter((f) => f.isId === false)
                .filter((f) => f.isGenerated === false)
                .filter((f) => relationFieldsId.includes(f.name))
                .forEach((field) => {
                  writer
                    .write(`${field.name}: ${getZodConstructor(field)}`)
                    .write(',')
                    .newLine();
                });
            })
            .write(')');
        },
      },
    ],
  });
};

export const generateRelatedSchemaForModel = (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prismaOptions: PrismaOptions
) => {
  const { modelName, relatedModelName } = useModelNames(config);

  const relationFields = model.fields.filter((f) => f.kind === 'object');

  sourceFile.addInterface({
    name: `Complete${model.name}`,
    isExported: true,
    extends: [`z.infer<typeof ${modelName(model.name)}>`],
    properties: relationFields.map((f) => ({
      hasQuestionToken: !f.isRequired,
      name: f.name,
      type: `Complete${f.type}${f.isList ? '[]' : ''}${!f.isRequired ? ' | null' : ''}`,
    })),
  });

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: relatedModelName(model.name),
        type: `z.ZodSchema<Complete${model.name}>`,
        initializer(writer) {
          writer
            .write(`z.lazy(() => ${modelName(model.name)}.extend(`)
            .inlineBlock(() => {
              relationFields.forEach((field) => {
                writer
                  .write(`${field.name}: ${getZodConstructor(field, relatedModelName)}`)
                  .write(',')
                  .newLine();
              });
            })
            .write('))');
        },
      },
    ],
  });
};

export const populateModelFile = (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config,
  prismaOptions: PrismaOptions
) => {
  /// NOTE: Write of all needed imports
  writeImportsForModel(model, sourceFile, config, prismaOptions);
  /// NOTE: Generate the actual schema
  generateSchemaForModel(model, sourceFile, config, prismaOptions);
  if (needsRelatedModel(model, config))
    generateRelatedSchemaForModel(model, sourceFile, config, prismaOptions);
};

export const generateBarrelFile = (models: DMMF.Model[], indexFile: SourceFile) => {
  /// NOTE: for each model, generate an import statement on the index.ts file
  models.forEach((model) =>
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${model.name.toLowerCase()}`,
    })
  );
  /// NOTE: format the file
  indexFile.formatText(formatStyle);
};
