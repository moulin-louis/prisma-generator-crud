import * as z from 'zod';
import { CompleteStep, RelatedStep, CompleteFeature, RelatedFeature } from './index';

export const Scenario = z.object({
  id: z.number().int(),
  title: z.string(),
  browserType: z.string(),
  featureId: z.number().int().nullish(),
});

export const CreateScenario = z.object({
  title: z.string(),
  browserType: z.string(),
});

export const CreateNestedScenario = z.object({
  title: z.string(),
  browserType: z.string(),
  steps: Step.array(),
  Feature: Feature.nullish(),
});

export interface CompleteScenario extends z.infer<typeof Scenario> {
  steps: CompleteStep[];
  Feature?: CompleteFeature | null;
}

export const RelatedScenario: z.ZodSchema<CompleteScenario> = z.lazy(() =>
  Scenario.extend({
    steps: RelatedStep.array(),
    Feature: RelatedFeature.nullish(),
  })
);
