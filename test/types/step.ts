import * as z from 'zod';
import { KeywordType } from '@prisma/client';
import {
  CompleteElementHTML,
  RelatedElementHTML,
  CompleteScenario,
  RelatedScenario,
} from './index';

export const Step = z.object({
  id: z.number().int(),
  type: z.nativeEnum(KeywordType).nullish(),
  definition: z.string(),
  url: z.string(),
  exists: z.boolean(),
  scenarioId: z.number().int().nullish(),
});

export const CreateStep = z.object({
  type: z.nativeEnum(KeywordType).nullish(),
  definition: z.string(),
  url: z.string(),
  exists: z.boolean(),
});

export interface CompleteStep extends z.infer<typeof Step> {
  elements?: CompleteElementHTML | null;
  Scenario?: CompleteScenario | null;
}

export const RelatedStep: z.ZodSchema<CompleteStep> = z.lazy(() =>
  Step.extend({
    elements: RelatedElementHTML.nullish(),
    Scenario: RelatedScenario.nullish(),
  })
);
