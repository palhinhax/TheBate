import { z } from "zod";
import { SUPPORTED_LANGUAGES } from "@/lib/language-shared";

export const topicOptionSchema = z.object({
  label: z
    .string()
    .min(1, "O nome da opção é obrigatório")
    .max(100, "O nome da opção não pode ter mais de 100 caracteres"),
  description: z.string().max(500, "A descrição não pode ter mais de 500 caracteres").optional(),
  order: z.number().int().min(0).default(0),
});

export const topicSchema = z
  .object({
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
    type: z.enum(["YES_NO", "MULTI_CHOICE"]).optional().default("YES_NO"),
    allowMultipleVotes: z.boolean().optional().default(false),
    maxChoices: z.number().int().min(1).max(10).optional().default(1),
    options: z.array(topicOptionSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "MULTI_CHOICE") {
        return data.options && data.options.length >= 2;
      }
      return true;
    },
    {
      message: "Temas de múltipla escolha devem ter pelo menos 2 opções",
      path: ["options"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "MULTI_CHOICE" && data.allowMultipleVotes) {
        return data.maxChoices <= (data.options?.length || 0);
      }
      return true;
    },
    {
      message: "O número máximo de escolhas não pode exceder o número de opções",
      path: ["maxChoices"],
    }
  );

export const updateTopicSchema = z.object({
  status: z.enum(["ACTIVE", "HIDDEN", "LOCKED"]),
});

export const yesNoVoteSchema = z.object({
  vote: z.enum(["SIM", "NAO", "DEPENDE"]),
});

export const multiChoiceVoteSchema = z.object({
  optionIds: z.array(z.string()).min(1, "Selecione pelo menos uma opção"),
});

export type TopicFormData = z.infer<typeof topicSchema>;
export type UpdateTopicData = z.infer<typeof updateTopicSchema>;
export type TopicOptionData = z.infer<typeof topicOptionSchema>;
export type YesNoVoteData = z.infer<typeof yesNoVoteSchema>;
export type MultiChoiceVoteData = z.infer<typeof multiChoiceVoteSchema>;
