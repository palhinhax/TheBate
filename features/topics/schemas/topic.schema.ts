import { z } from "zod";
import { SUPPORTED_LANGUAGES } from "@/lib/language-shared";

export const topicSchema = z.object({
  title: z
    .string()
    .min(5, "O título deve ter pelo menos 5 caracteres")
    .max(200, "O título não pode ter mais de 200 caracteres"),
  description: z
    .string()
    .min(20, "A descrição deve ter pelo menos 20 caracteres")
    .max(5000, "A descrição não pode ter mais de 5000 caracteres"),
  language: z.enum(SUPPORTED_LANGUAGES),
  tags: z
    .array(z.string().min(2).max(30))
    .min(1, "Adicione pelo menos uma tag")
    .max(5, "Máximo de 5 tags permitidas"),
});

export const updateTopicSchema = z.object({
  status: z.enum(["ACTIVE", "HIDDEN", "LOCKED"]),
});

export type TopicFormData = z.infer<typeof topicSchema>;
export type UpdateTopicData = z.infer<typeof updateTopicSchema>;
