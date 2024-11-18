import * as z from "zod";
import { CreateScenarioSchema } from "./index";

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
    scenarios: CreateScenarioSchema.array(),
});

export type CreateNestedFeature = z.infer<typeof CreateNestedFeatureSchema>;
