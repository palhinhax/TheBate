import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(20, "O comentário deve ter pelo menos 20 caracteres")
    .max(800, "O comentário não pode ter mais de 800 caracteres"),
  side: z.enum(["AFAVOR", "CONTRA"], {
    required_error: "Você deve escolher um lado (A Favor ou Contra)",
  }),
  topicId: z.string(),
  parentId: z.string().optional(),
});

export const replySchema = z.object({
  content: z
    .string()
    .min(1, "A resposta não pode estar vazia")
    .max(800, "A resposta não pode ter mais de 800 caracteres"),
  topicId: z.string(),
  parentId: z.string(),
});

export const voteSchema = z.object({
  commentId: z.string(),
  value: z.literal(1), // Only +1 for quality vote
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(20, "O comentário deve ter pelo menos 20 caracteres")
    .max(800, "O comentário não pode ter mais de 800 caracteres"),
});

export const moderateCommentSchema = z.object({
  status: z.enum(["ACTIVE", "HIDDEN", "DELETED"]),
});

export type CommentFormData = z.infer<typeof commentSchema>;
export type ReplyFormData = z.infer<typeof replySchema>;
export type VoteData = z.infer<typeof voteSchema>;
export type UpdateCommentData = z.infer<typeof updateCommentSchema>;
export type ModerateCommentData = z.infer<typeof moderateCommentSchema>;
