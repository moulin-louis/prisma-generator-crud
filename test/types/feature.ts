import * as z from 'zod';
import { CompleteScenario, RelatedScenario } from './index';

export const Feature = z.object({
  id: z.number().int(),
  title: z.string(),
});

export const CreateFeature = z.object({
  title: z.string(),
});

export const CreateNestedFeature = z.object({
  title: z.string(),
  scenarios: Scenario.array(),
});

export interface CompleteFeature extends z.infer<typeof Feature> {
  scenarios: CompleteScenario[];
}

export const RelatedFeature: z.ZodSchema<CompleteFeature> = z.lazy(() =>
  Feature.extend({
    scenarios: RelatedScenario.array(),
  })
);
