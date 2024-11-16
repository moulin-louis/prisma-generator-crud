import * as z from "zod";
import { ElementType } from "@prisma/client";
import { CompleteLocator, RelatedLocatorSchema, CompleteStep, RelatedStepSchema } from "./index";
import { CreateLocator, RelatedLocatorSchema, CreateStep, RelatedStepSchema } from "./index";

export const ElementHTMLSchema = z.object({
    id: z.number().int(),
    type: z.nativeEnum(ElementType),
    data: z.string(),
    dataInput: z.string().nullish(),
    elementList: z.string().nullish(),
    stepId: z.number().int(),
});

export type ElementHTML = z.infer<typeof ElementHTMLSchema>;

export const CreateElementHTMLSchema = z.object({
    type: z.nativeEnum(ElementType),
    data: z.string(),
    dataInput: z.string().nullish(),
    elementList: z.string().nullish(),
});

export type CreateElementHTML = z.infer<typeof CreateElementHTMLSchema>;

export const CreateNestedElementHTMLSchema = z.object({
    type: z.nativeEnum(ElementType),
    locator: CreateLocator.array(),
    data: z.string(),
    dataInput: z.string().nullish(),
    elementList: z.string().nullish(),
    Step: CreateStep,
});

export interface CompleteElementHTML extends z.infer<typeof ElementHTMLSchema> {
    locator: CompleteLocator[];
    Step: CompleteStep;
}

export const RelatedElementHTMLSchema: z.ZodSchema<CompleteElementHTML> = z.lazy(() => ElementHTMLSchema.extend({
    locator: RelatedLocatorSchema.array(),
    Step: RelatedStepSchema,
}));
