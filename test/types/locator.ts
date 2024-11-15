import * as z from 'zod';
import { CompleteElementHTML, RelatedElementHTML } from './index';

export const Locator = z.object({
  id: z.number().int(),
  type: z.string(),
  data: z.string(),
  elementHTMLId: z.number().int(),
});

export const CreateLocator = z.object({
  type: z.string(),
  data: z.string(),
});

export const CreateNestedLocator = z.object({
  type: z.string(),
  data: z.string(),
  ElementHTML: ElementHTML,
});

export interface CompleteLocator extends z.infer<typeof Locator> {
  ElementHTML: CompleteElementHTML;
}

export const RelatedLocator: z.ZodSchema<CompleteLocator> = z.lazy(() =>
  Locator.extend({
    ElementHTML: RelatedElementHTML,
  })
);
