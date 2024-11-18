import * as z from "zod";
import { ElementType } from "@prisma/client";
import { CreateLocatorSchema, CreateStepSchema } from "./index";

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
    locator: CreateLocatorSchema.array(),
    data: z.string(),
    dataInput: z.string().nullish(),
    elementList: z.string().nullish(),
});

export type CreateNestedElementHTML = z.infer<typeof CreateNestedElementHTMLSchema>;
