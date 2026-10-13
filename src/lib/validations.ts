import { z } from "zod";
import { STATUSES } from "./constants";

export const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
});

const text = z
  .string()
  .trim()
  .transform((v) => v || null)
  .optional();

export const applicationSchema = z.object({
  company: z.string().trim().min(1),
  position: z.string().trim().min(1),
  link: z
    .string()
    .trim()
    .url()
    .or(z.literal(""))
    .transform((v) => v || null)
    .optional(),
  salary: text,
  notes: text,
  deadline: z
    .string()
    .transform((v) => (v ? new Date(v) : null))
    .refine((d) => d === null || !isNaN(d.getTime()))
    .optional(),
  status: z.enum(STATUSES).optional(),
});
