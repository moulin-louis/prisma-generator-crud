import * as z from "zod";
import { CompleteScenario, RelatedScenarioSchema, CreateScenarioSchema } from "./index";

export const FeatureSchema = z.object({
    id: z.number().int(),
    title: z.string(),
});

export type Feature = z.infer<typeof FeatureSchema>;

export const CreateFeatureSchema = z.object({
    title: z.string(),
});

export type CreateFeature = z.infer<typeof CreateFeatureSchema>;

export const CreateNestedFeatureSchema = z.object({
    title: z.string(),
    scenarios: CreateScenario.array()Schema,
});

export interface CompleteFeature extends z.infer<typeof FeatureSchema> {
    scenarios: CompleteScenario[];
}

export const RelatedFeatureSchema: z.ZodSchema<CompleteFeature> = z.lazy(() => FeatureSchema.extend({
    scenarios: RelatedScenarioSchema.array(),
}));
