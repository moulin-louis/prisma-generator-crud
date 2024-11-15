import * as z from 'zod';
import { ElementType } from '@prisma/client';
import { CompleteLocator, RelatedLocatorSchema, CompleteStep, RelatedStepSchema } from './index';

export const ElementHTMLSchema = z.object({
  id: z.number().int(),
  type: z.nativeEnum(ElementType),
  data: z.string(),
  dataInput: z.string().nullish(),
  elementList: z.string().nullish(),
  stepId: z.number().int(),
});

export type ElementHTMLSchema = z.infer<typeof ElementHTMLSchema>;

export const CreateElementHTMLSchema = z.object({
  type: z.nativeEnum(ElementType),
  data: z.string(),
  dataInput: z.string().nullish(),
  elementList: z.string().nullish(),
});

export const CreateNestedElementHTMLSchema = z.object({
  type: z.nativeEnum(ElementType),
  locator: Locator.array(),
  data: z.string(),
  dataInput: z.string().nullish(),
  elementList: z.string().nullish(),
  Step: Step,
});

export interface CompleteElementHTML extends z.infer<typeof ElementHTMLSchema> {
  locator: CompleteLocator[];
  Step: CompleteStep;
}

export const RelatedElementHTMLSchema: z.ZodSchema<CompleteElementHTML> = z.lazy(() =>
  ElementHTMLSchema.extend({
    locator: RelatedLocatorSchema.array(),
    Step: RelatedStepSchema,
  })
);
