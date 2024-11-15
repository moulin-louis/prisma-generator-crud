import * as z from 'zod';
import { ElementType } from '@prisma/client';
import { CompleteLocator, RelatedLocator, CompleteStep, RelatedStep } from './index';

export const ElementHTML = z.object({
  id: z.number().int(),
  type: z.nativeEnum(ElementType),
  data: z.string(),
  dataInput: z.string().nullish(),
  elementList: z.string().nullish(),
  stepId: z.number().int(),
});

export const CreateElementHTML = z.object({
  type: z.nativeEnum(ElementType),
  data: z.string(),
  dataInput: z.string().nullish(),
  elementList: z.string().nullish(),
});

export interface CompleteElementHTML extends z.infer<typeof ElementHTML> {
  locator: CompleteLocator[];
  Step: CompleteStep;
}

export const RelatedElementHTML: z.ZodSchema<CompleteElementHTML> = z.lazy(() =>
  ElementHTML.extend({
    locator: RelatedLocator.array(),
    Step: RelatedStep,
  })
);
