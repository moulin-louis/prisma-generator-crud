import * as z from "zod";
import { CompleteStep, RelatedStepSchema, CompleteFeature, RelatedFeatureSchema } from "./index";
import { CreateStep, RelatedStepSchema, CreateFeature, RelatedFeatureSchema } from "./index";

export const ScenarioSchema = z.object({
    id: z.number().int(),
    title: z.string(),
    browserType: z.string(),
    featureId: z.number().int().nullish(),
});

export type Scenario = z.infer<typeof ScenarioSchema>;

export const CreateScenarioSchema = z.object({
    title: z.string(),
    browserType: z.string(),
});

export type CreateScenario = z.infer<typeof CreateScenarioSchema>;

export const CreateNestedScenarioSchema = z.object({
    title: z.string(),
    browserType: z.string(),
    steps: CreateStep.array(),
    Feature: CreateFeature.nullish(),
});

export interface CompleteScenario extends z.infer<typeof ScenarioSchema> {
    steps: CompleteStep[];
    Feature?: CompleteFeature | null;
}

export const RelatedScenarioSchema: z.ZodSchema<CompleteScenario> = z.lazy(() => ScenarioSchema.extend({
    steps: RelatedStepSchema.array(),
    Feature: RelatedFeatureSchema.nullish(),
}));
