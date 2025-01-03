import { z } from 'zod';

const configBoolean = z.enum(['true', 'false']).transform((arg) => JSON.parse(arg));

export const configSchema = z.object({
  relationModel: configBoolean.default('false').or(z.literal('default')),
  modelCase: z.enum(['PascalCase', 'camelCase']).default('PascalCase'),
});

export type Config = z.infer<typeof configSchema>;

export type PrismaOptions = {
  schemaPath: string;
  outputPath: string;
  clientPath: string;
};

export type Names = {
  model: string;
  related: string;
};
