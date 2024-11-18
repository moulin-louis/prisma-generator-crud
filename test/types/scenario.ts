import * as z from "zod";
import { CreateStepSchema, CreateFeatureSchema } from "./index";

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
    steps: CreateStepSchema.array(),
});

export type CreateNestedScenario = z.infer<typeof CreateNestedScenarioSchema>;
