import * as z from 'zod';
import { CompleteScenario, RelatedScenarioSchema } from './index';

export const FeatureSchema = z.object({
  id: z.number().int(),
  title: z.string(),
});

export type FeatureSchema = z.infer<typeof FeatureSchema>;

export const CreateFeatureSchema = z.object({
  title: z.string(),
});

export const CreateNestedFeatureSchema = z.object({
  title: z.string(),
  scenarios: Scenario.array(),
});

export interface CompleteFeature extends z.infer<typeof FeatureSchema> {
  scenarios: CompleteScenario[];
}

export const RelatedFeatureSchema: z.ZodSchema<CompleteFeature> = z.lazy(() =>
  FeatureSchema.extend({
    scenarios: RelatedScenarioSchema.array(),
  })
);
