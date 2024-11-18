import * as z from "zod";
import { CreateElementHTMLSchema } from "./index";

export const LocatorSchema = z.object({
    id: z.number().int(),
    type: z.string(),
    data: z.string(),
    elementHTMLId: z.number().int(),
});

export type Locator = z.infer<typeof LocatorSchema>;

export const CreateLocatorSchema = z.object({
    type: z.string(),
    data: z.string(),
});

export type CreateLocator = z.infer<typeof CreateLocatorSchema>;

export const CreateNestedLocatorSchema = z.object({
    type: z.string(),
    data: z.string(),
});

export type CreateNestedLocator = z.infer<typeof CreateNestedLocatorSchema>;
