import { DMMF } from '@prisma/generator-helper';
import { Config } from './config';

export const useModelNames = ({ modelCase, relationModel }: Config) => {
  const formatModelName = (name: string, prefix = '') => {
    if (modelCase === 'camelCase') {
      name = name.slice(0, 1).toLowerCase() + name.slice(1);
    }
    return `${prefix}${name}`;
  };

  return {
    modelName: (name: string) => formatModelName(name, relationModel === 'default' ? '_' : ''),
    relatedModelName: (name: string | DMMF.SchemaEnum | DMMF.OutputType | DMMF.SchemaArg) =>
      formatModelName(relationModel === 'default' ? name.toString() : `Related${name.toString()}`),
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
