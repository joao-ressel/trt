import z from "zod";

export const schemaTransaction = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.number(),
  type: z.string(),
  direction: z.enum(["in", "out"]),
  transaction_date: z.string(),

  category_id: z.string(),
  account_id: z.string(),

  account_name: z.string(),
  category_name: z.string(),
});

export type FormattedTransaction = z.infer<typeof schemaTransaction>;
