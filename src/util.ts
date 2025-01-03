import { DMMF } from '@prisma/generator-helper';
import { Config } from './config';
import { FormatCodeSettings, ts } from 'ts-morph';

export const formatStyle: FormatCodeSettings = {
  semicolons: ts.SemicolonPreference.Insert,
  tabSize: 2,
  convertTabsToSpaces: true,
};

export const useModelNames = ({ modelCase, relationModel }: Config) => {
  const formatModelName = (name: string) => {
    if (modelCase === 'camelCase') {
      name = name.slice(0, 1).toLowerCase() + name.slice(1);
    }
    return `${name}Schema`;
  };

  const formatCreateName = (name: string) => {
    return `Create${name}Schema`;
  };
  const formatCreateNestedName = (name: string) => {
    return `CreateNested${name}Schema`;
  };

  return {
    modelName: (name: string) => formatModelName(name),
    relatedModelName: (name: string | DMMF.SchemaEnum | DMMF.OutputType | DMMF.SchemaArg) =>
      formatModelName(relationModel === 'default' ? name.toString() : `Related${name.toString()}`),
    createName: (name: string) => formatCreateName(name),
    createNestedName: (name: string) => formatCreateNestedName(name),
  };
};

export const needsRelatedModel = (model: DMMF.Model, config: Config) => {
  return model.fields.some((field) => field.kind === 'object') && config.relationModel !== false;
};

export const dotSlash = (input: string) => {
  const converted = input
    .replace(/^\\\\\?\\/, '')
    .replace(/\\/g, '/')
    .replace(/\/\/+/g, '/');

  if (converted.includes(`/node_modules/`)) return converted.split(`/node_modules/`).slice(-1)[0];

  if (converted.startsWith(`../`)) return converted;

  return './' + converted;
};
