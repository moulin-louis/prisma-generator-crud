import * as z from 'zod';
import { CompleteElementHTML, RelatedElementHTMLSchema } from './index';

export const LocatorSchema = z.object({
  id: z.number().int(),
  type: z.string(),
  data: z.string(),
  elementHTMLId: z.number().int(),
});

export type LocatorSchema = z.infer<typeof LocatorSchema>;

export const CreateLocatorSchema = z.object({
  type: z.string(),
  data: z.string(),
});

export const CreateNestedLocatorSchema = z.object({
  type: z.string(),
  data: z.string(),
  ElementHTML: ElementHTML,
});

export interface CompleteLocator extends z.infer<typeof LocatorSchema> {
  ElementHTML: CompleteElementHTML;
}

export const RelatedLocatorSchema: z.ZodSchema<CompleteLocator> = z.lazy(() =>
  LocatorSchema.extend({
    ElementHTML: RelatedElementHTMLSchema,
  })
);
