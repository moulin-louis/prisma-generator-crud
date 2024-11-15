import * as z from 'zod';

export const User = z.object({
  id: z.number().int(),
  email: z.string(),
  name: z.string().nullish(),
});

export const CreateUser = z.object({
  email: z.string(),
  name: z.string().nullish(),
});
