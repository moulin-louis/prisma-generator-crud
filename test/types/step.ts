import * as z from "zod";
import { KeywordType } from "@prisma/client";
import { CompleteElementHTML, RelatedElementHTMLSchema, CompleteScenario, RelatedScenarioSchema } from "./index";
import { CreateElementHTML, RelatedElementHTMLSchema, CreateScenario, RelatedScenarioSchema } from "./index";

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
    elements: CreateElementHTML.nullish(),
    Scenario: CreateScenario.nullish(),
});

export interface CompleteStep extends z.infer<typeof StepSchema> {
    elements?: CompleteElementHTML | null;
    Scenario?: CompleteScenario | null;
}

export const RelatedStepSchema: z.ZodSchema<CompleteStep> = z.lazy(() => StepSchema.extend({
    elements: RelatedElementHTMLSchema.nullish(),
    Scenario: RelatedScenarioSchema.nullish(),
}));
