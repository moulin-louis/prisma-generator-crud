import * as z from "zod";
import { KeywordType } from "@prisma/client";
import { CreateElementHTMLSchema, CreateScenarioSchema } from "./index";

export const StepSchema = z.object({
    id: z.number().int(),
    type: z.nativeEnum(KeywordType).nullish(),
    definition: z.string(),
    url: z.string(),
    exists: z.boolean(),
    scenarioId: z.number().int().nullish(),
});

export type Step = z.infer<typeof StepSchema>;

export const CreateStepSchema = z.object({
    type: z.nativeEnum(KeywordType).nullish(),
    definition: z.string(),
    url: z.string(),
    exists: z.boolean(),
});

export type CreateStep = z.infer<typeof CreateStepSchema>;

export const CreateNestedStepSchema = z.object({
    type: z.nativeEnum(KeywordType).nullish(),
    definition: z.string(),
    url: z.string(),
    exists: z.boolean(),
    elements: CreateElementHTMLSchema.nullish(),
});

export type CreateNestedStep = z.infer<typeof CreateNestedStepSchema>;
