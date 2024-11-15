// Importing package.json for automated synchronization of version numbers
import { version } from '../package.json';
import { generatorHandler } from '@prisma/generator-helper';
import { logger } from '@prisma/sdk';
import { configSchema, PrismaOptions } from './config';
import { populateModelFile, generateBarrelFile } from './generator';
import { Project } from 'ts-morph';
import { formatStyle } from './util';

generatorHandler({
  onManifest() {
    return {
      version,
      prettyName: 'Zod Schemas',
      defaultOutput: 'zod',
    };
  },
  onGenerate(options) {
    const project = new Project();

    const models = [...options.dmmf.datamodel.models];

    const { schemaPath } = options;
    const outputPath = options.generator.output!.value || './output/';
    const prismaClientJsGenerators = options.otherGenerators.find((each) => {
      return each.provider.value === 'prisma-client-js';
    });

    const clientPath = prismaClientJsGenerators?.output?.value;
    if (clientPath === null || clientPath === undefined) {
      logger.error(`Failed to find prisma-client-js`);
      throw new Error('Failed to find prisma-client-js');
    }
    logger.info(`clientPath = ${clientPath}`);
    const results = configSchema.safeParse(options.generator.config);
    if (!results.success)
      throw new Error(
        'Incorrect config provided. Please check the values you provided and try again.'
      );

    const config = results.data;
    const prismaOptions: PrismaOptions = {
      clientPath,
      outputPath,
      schemaPath,
    };

    const indexFile = project.createSourceFile(
      `${outputPath}/index.ts`,
      {},
      {
        overwrite: true,
      }
    );

    generateBarrelFile(models, indexFile);

    models.forEach((model) => {
      logger.info(`generating schema for ${model.name}`);
      //logger.info(`${model.name} fields: `);
      //model.fields.forEach((field) => {
      //  logger.info(`\t${field.name}: `, field);
      //})
      /// NOTE: Creating the file
      const sourceFile = project.createSourceFile(
        `${outputPath}/${model.name.toLowerCase()}.ts`,
        {},
        {
          overwrite: true,
        }
      );
      /// NOTE: Populate the file
      populateModelFile(model, sourceFile, config, prismaOptions);
      /// NOTE: format the file
      sourceFile.formatText(formatStyle);
    });

    return project.save();
  },
});
