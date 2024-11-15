import path from 'path';
import { DMMF } from '@prisma/generator-helper';
import {
  ImportDeclarationStructure,
  SourceFile,
  StructureKind,
  VariableDeclarationKind,
} from 'ts-morph';
import { Config, PrismaOptions } from './config';
import { dotSlash, needsRelatedModel, useModelNames } from './util';
import { getZodConstructor } from './types';

export const writeImportsForModel = (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config,
  { outputPath, clientPath }: PrismaOptions
) => {
  const { relatedModelName } = useModelNames(config);
  const importList: ImportDeclarationStructure[] = [
    {
      kind: StructureKind.ImportDeclaration,
      namespaceImport: 'z',
      moduleSpecifier: 'zod',
    },
  ];

  const enumFields = model.fields.filter((f) => f.kind === 'enum');
  const relationFields = model.fields.filter((f) => f.kind === 'object');
  const relativePath = path.relative(outputPath, clientPath);

  if (enumFields.length > 0) {
    importList.push({
      kind: StructureKind.ImportDeclaration,
      isTypeOnly: enumFields.length === 0,
      moduleSpecifier: dotSlash(relativePath),
      namedImports: enumFields.map((f) => f.type),
    });
  }

  if (config.relationModel !== false && relationFields.length > 0) {
    const filteredFields = relationFields.filter((f) => f.type !== model.name);

    if (filteredFields.length > 0) {
      importList.push({
        kind: StructureKind.ImportDeclaration,
        moduleSpecifier: './index',
        namedImports: Array.from(
          new Set(
            filteredFields.flatMap((f) => [
              `Complete${f.type}`,
              relatedModelName(f.type),
            ])
          )
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
) => {
  const { modelName } = useModelNames(config);

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
                  .write(
                    `${field.name}: ${getZodConstructor(field, relatedModelName)}`
                  )
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
  writeImportsForModel(model, sourceFile, config, prismaOptions);
  generateSchemaForModel(model, sourceFile, config, prismaOptions);
  if (needsRelatedModel(model, config))
    generateRelatedSchemaForModel(model, sourceFile, config, prismaOptions);
};

export const generateBarrelFile = (
  models: DMMF.Model[],
  indexFile: SourceFile
) => {
  models.forEach((model) =>
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${model.name.toLowerCase()}`,
    })
  );
};
