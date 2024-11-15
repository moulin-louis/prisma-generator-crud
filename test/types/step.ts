import * as z from 'zod';
import { KeywordType } from '@prisma/client';
import {
  CompleteElementHTML,
  RelatedElementHTMLSchema,
  CompleteScenario,
  RelatedScenarioSchema,
} from './index';

export const StepSchema = z.object({
  id: z.number().int(),
  type: z.nativeEnum(KeywordType).nullish(),
  definition: z.string(),
  url: z.string(),
  exists: z.boolean(),
  scenarioId: z.number().int().nullish(),
});

export type StepSchema = z.infer<typeof StepSchema>;

export const CreateStepSchema = z.object({
  type: z.nativeEnum(KeywordType).nullish(),
  definition: z.string(),
  url: z.string(),
  exists: z.boolean(),
});

export const CreateNestedStepSchema = z.object({
  type: z.nativeEnum(KeywordType).nullish(),
  definition: z.string(),
  url: z.string(),
  exists: z.boolean(),
  elements: ElementHTML.nullish(),
  Scenario: Scenario.nullish(),
});

export interface CompleteStep extends z.infer<typeof StepSchema> {
  elements?: CompleteElementHTML | null;
  Scenario?: CompleteScenario | null;
}

export const RelatedStepSchema: z.ZodSchema<CompleteStep> = z.lazy(() =>
  StepSchema.extend({
    elements: RelatedElementHTMLSchema.nullish(),
    Scenario: RelatedScenarioSchema.nullish(),
  })
);
